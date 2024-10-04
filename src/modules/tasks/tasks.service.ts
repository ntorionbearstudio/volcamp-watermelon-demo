import { useCallback, useEffect, useState } from 'react';

import { database } from '@/database';
import Task from '@/models/Task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    const allTasks = await database.get('tasks').query().fetch();

    setTasks(allTasks as Task[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return { tasks, refresh: loadTasks, isLoading };
};

export const createTask = async ({
  name,
  icon,
  isUrgent,
}: {
  name: string;
  icon: string;
  isUrgent: boolean;
}): Promise<Task | null> => {
  try {
    const createdTask = await database.write(async () => {
      return await database.get('tasks').create((task) => {
        (task as Task).name = name;
        (task as Task).icon = icon;
        (task as Task).isDone = false;
        (t as Task).isUrgent = isUrgent;
      });
    });
    return createdTask as Task;
  } catch (e) {
    return null;
  }
};

export const updateTask = async ({
  task,
  name,
  icon,
  isUrgent,
}: {
  task: Task;
  name: string;
  icon: string;
  isUrgent: boolean;
}): Promise<Task | null> => {
  try {
    const updatedTask = await database.write(async () => {
      return await task.update((t) => {
        (t as Task).name = name;
        (t as Task).icon = icon;
        (t as Task).isDone = false;
        (t as Task).isUrgent = isUrgent;
      });
    });
    return updatedTask as Task;
  } catch (e) {
    return null;
  }
};
