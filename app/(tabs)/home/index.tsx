import { useEffect, useState } from 'react';

import {
  Badge,
  Box,
  Button,
  HStack,
  Icon,
  Text,
  TouchableOpacity,
  VStack,
  useDisclosure,
} from 'react-native-ficus-ui';
import Animated, { LinearTransition } from 'react-native-reanimated';

import TaskModal from '@/components/TaskModal';
import { syncDatabase } from '@/database';
import Task from '@/models/Task';
import { useTasks } from '@/modules/tasks/tasks.service';

const sortByName = (a: Task, b: Task) => {
  const nameA = a.name.toUpperCase(); // ignore upper and lowercase
  const nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
};

const TaskComponent = ({
  task,
  onPress,
  onLongPress,
}: {
  task: Task;
  onPress: () => void;
  onLongPress: () => void;
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
    <TouchableOpacity
      overflow="visible"
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Box
        p="lg"
        bg="white"
        borderWidth={1}
        borderColor="gray.200"
        borderRadius="xl"
        opacity={task.isDone ? 0.6 : 1}
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
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

          <Box>
            <Badge variant="outline" colorScheme="red">
              Urgent
            </Badge>
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

const Home = () => {
  const {
    isOpen: isModalOpen,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const { tasks, refresh, isLoading } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const handlePressTask = (task: Task) => async () => {
    if (task.isDone) {
      await task.markAsUndone();
    } else {
      await task.markAsDone();
    }

    await refresh();
  };

  const handleLongPressTask = (task: Task) => () => {
    setSelectedTask(task);
    onOpenModal();
  };

  const handleSynchronise = async () => {
    await syncDatabase();
    await refresh();
  };

  useEffect(() => {
    syncDatabase();
  }, []);

  const allTasks = [
    ...tasks.filter((task) => !task.isDone).sort(sortByName),
    { id: 'separator' } as Task,
    ...tasks
      .filter((task) => task.isDone)
      .sort((a, b) => Number(a.updatedAt) - Number(b.updatedAt))
      .slice(0, 4),
  ];

  return (
    <Box h="100%" p={20} justifyContent="space-between">
      <Animated.FlatList
        data={allTasks}
        refreshing={isLoading}
        renderItem={({ item }: { item: Task }) => (
          <TaskComponent
            task={item}
            onPress={handlePressTask(item)}
            onLongPress={handleLongPressTask(item)}
          />
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
          onPress={() => {
            setSelectedTask(undefined);
            onOpenModal();
          }}
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

      <TaskModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        onRefresh={refresh}
        task={selectedTask}
      />
    </Box>
  );
};

export default Home;
