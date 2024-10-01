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
}: {
  name: string;
  icon: string;
}): Promise<Task | null> => {
  try {
    const createdTask = await database.write(async () => {
      return await database.get('tasks').create((task) => {
        (task as Task).name = name;
        (task as Task).icon = icon;
        (task as Task).isDone = false;
      });
    });
    return createdTask as Task;
  } catch (e) {
    return null;
  }
};
