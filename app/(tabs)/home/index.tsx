import { useState } from 'react';

import { Formiz, useForm } from '@formiz/core';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
  Modal,
  Text,
  TouchableOpacity,
  VStack,
  useDisclosure,
} from 'react-native-ficus-ui';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { FieldInput } from '@/components/FieldInput';
import { syncDatabase } from '@/database';
import Task from '@/models/Task';
import { createTask, useTasks } from '@/modules/tasks/tasks.service';

const TaskComponent = ({
  task,
  onPress,
}: {
  task: Task;
  onPress: () => void;
}) => {
  if (task.id === 'separator') {
    return (
      <Box my="lg">
        <Text fontSize="xl" fontWeight="bold">
          Tâches terminées
        </Text>
      </Box>
    );
  }

  return (
    <TouchableOpacity overflow="visible" onPress={onPress}>
      <Box p="lg" bg="white" borderRadius="xl" opacity={task.isDone ? 0.6 : 1}>
        <HStack spacing="md" alignItems="center">
          <Text fontSize="6xl">{task.icon}</Text>
          <Text
            fontSize="xl"
            textDecorLine={task.isDone ? 'line-through' : 'none'}
            textDecorStyle="solid"
            textDecorColor="black"
          >
            {task.name}
          </Text>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
};

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { tasks, refresh, isLoading } = useTasks();
  const [selectedEmoji, setSelectedEmoji] = useState('🍊');

  const handlePressTask = (task: Task) => async () => {
    if (task.isDone) {
      await task.markAsUndone();
    } else {
      await task.markAsDone();
    }

    await refresh();
  };

  const handleCreateTask = async ({
    name,
    icon,
  }: {
    name: string;
    icon: string;
  }) => {
    await createTask({
      name,
      icon,
    });
    await refresh();
  };

  const handleSynchronise = async () => {
    await syncDatabase();
    await refresh();
  };

  const form = useForm({
    onValidSubmit: (values) => {
      handleCreateTask({ name: values.name, icon: selectedEmoji });
      onClose();
    },
  });

  const allTasks = [
    ...tasks.filter((task) => !task.isDone),
    { id: 'separator' } as Task,
    ...tasks.filter((task) => task.isDone),
  ];

  return (
    <Box h="100%" p={20} justifyContent="space-between">
      <Animated.FlatList
        data={allTasks}
        refreshing={isLoading}
        renderItem={({ item }: { item: Task }) => (
          <TaskComponent task={item} onPress={handlePressTask(item)} />
        )}
        keyExtractor={(item) => `task-${item.id}`}
        itemLayoutAnimation={LinearTransition.springify()
          .stiffness(300)
          .damping(100)
          .mass(1)}
        skipEnteringExitingAnimations
        removeClippedSubviews={false}
        ItemSeparatorComponent={() => <Box h={10} />}
      />

      <VStack spacing="md">
        <Button
          full
          bg="transparent"
          color="brand.500"
          colorScheme="white"
          borderWidth={1}
          borderColor="brand.500"
          onPress={onOpen}
        >
          Ajouter une tâche
        </Button>
        <Button
          full
          colorScheme="brand"
          prefix={<Icon name="sync" mr="md" color="white" />}
          onPress={handleSynchronise}
        >
          Resynchroniser
        </Button>
      </VStack>

      <Modal
        h={400}
        isOpen={isOpen}
        p="xl"
        onBackdropPress={onClose}
        avoidKeyboard
      >
        <Box justifyContent="space-between" flex={1}>
          <Formiz connect={form}>
            <Text fontWeight="bold" fontSize="2xl">
              Ajouter une tâche
            </Text>

            <FieldInput
              name="name"
              componentProps={{
                placeholder: 'Nom de la tâche',
                autoFocus: true,
                autoCorrect: false,
                spellCheck: false,
                focusBorderColor: 'brand.500',
              }}
              required="Le nom de la tâche est requis"
              mt="md"
            />
            <Center my="md">
              <Text fontSize={70}>{selectedEmoji}</Text>
            </Center>
            <EmojiSelector
              showHistory={false}
              showSearchBar={false}
              showTabs={false}
              showSectionTitles={false}
              category={Categories.food}
              columns={8}
              onEmojiSelected={setSelectedEmoji}
            />
            <VStack spacing="md" mt="md">
              <Button full colorScheme="brand" onPress={() => form.submit()}>
                Valider
              </Button>
            </VStack>
          </Formiz>
        </Box>
      </Modal>
    </Box>
  );
};

export default Home;
