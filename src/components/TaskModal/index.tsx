import { useEffect, useState } from 'react';

import { Formiz, useForm } from '@formiz/core';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import {
  Box,
  Button,
  Center,
  Checkbox,
  Modal,
  Text,
  VStack,
} from 'react-native-ficus-ui';

import { FieldInput } from '@/components/FieldInput';
import Task from '@/models/Task';
import { createTask, updateTask } from '@/modules/tasks/tasks.service';

const TaskModal = ({
  isOpen,
  onClose,
  onRefresh,
  task,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  task?: Task;
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | undefined>('🍊');
  const [isUrgent, setIsUrgent] = useState<boolean>(false);

  const handleCreateTask = async ({
    name,
    icon,
    isUrgent,
  }: {
    name: string;
    icon: string;
    isUrgent: boolean;
  }) => {
    if (task?.id) {
      console.log({ isUrgent });
      await updateTask({
        task,
        name,
        icon,
        isUrgent,
      });
    } else {
      await createTask({
        name,
        icon,
        isUrgent,
      });
    }
    await onRefresh();
  };

  const form = useForm({
    onValidSubmit: (values) => {
      handleCreateTask({
        name: values.name,
        icon: selectedEmoji || '',
        isUrgent,
      });
      onClose();
    },
  });

  useEffect(() => {
    setSelectedEmoji(task?.icon || '🍊');
    setIsUrgent(task?.isUrgent || false);
  }, [task]);

  return (
    <Modal
      h={500}
      isOpen={isOpen}
      p="xl"
      onBackdropPress={onClose}
      avoidKeyboard
    >
      <Box justifyContent="space-between" flex={1}>
        <Formiz connect={form}>
          <Text fontWeight="bold" fontSize="2xl">
            {task?.id ? 'Editer une tâche' : 'Ajouter une tâche'}
          </Text>

          <FieldInput
            name="name"
            defaultValue={task?.name}
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
          <Checkbox
            colorScheme="brand"
            defaultChecked={isUrgent}
            isChecked={isUrgent}
            onChecked={setIsUrgent}
            prefix={<Text flex={1}>Tâche urgente</Text>}
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
  );
};

export default TaskModal;
