import { useEffect, useState } from 'react';

import { Formiz, useForm } from '@formiz/core';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import {
  Box,
  Button,
  Center,
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

  const handleCreateTask = async ({
    name,
    icon,
  }: {
    name: string;
    icon: string;
  }) => {
    if (task?.id) {
      await updateTask({
        task,
        name,
        icon,
      });
    } else {
      await createTask({
        name,
        icon,
      });
    }
    await onRefresh();
  };

  const form = useForm({
    onValidSubmit: (values) => {
      handleCreateTask({ name: values.name, icon: selectedEmoji || '' });
      onClose();
    },
  });

  useEffect(() => {
    setSelectedEmoji(task?.icon || '🍊');
  }, [task?.icon]);

  return (
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
