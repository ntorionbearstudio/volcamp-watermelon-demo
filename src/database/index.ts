import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { SyncDatabaseChangeSet, synchronize } from '@nozbe/watermelondb/sync';

import { api } from '@/api/generated-api';
import Task from '@/models/Task';

import migrations from './migrations';
import schema from './schema';

// import Post from './model/Post' // ⬅️ You'll import your Models here

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  // (You might want to comment it out for development purposes -- see Migrations documentation)
  migrations,
  // (optional database name or file system path)
  // dbName: 'myapp',
  // (recommended option, should work flawlessly out of the box on iOS. On Android,
  // additional installation steps have to be taken - disable if you run into issues...)
  jsi: false /* Platform.OS === 'ios' */,
  // (optional, but you should implement this method)
  onSetUpError: (error) => {
    // Database failed to load -- offer the user to reload the app or log out
  },
});

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [Task],
});

export const syncDatabase = async () => {
  console.log('🍉 SYNCING DATABASE...');

  await synchronize({
    database,
    migrationsEnabledAtVersion: 1,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      console.log('🍉 PULL CHANGES');

      console.log({
        lastPulledAt: lastPulledAt as number,
        schemaVersion,
        migration: JSON.stringify(migration),
      });

      const data = await api.syncPullChanges({
        lastPulledAt: lastPulledAt as number,
        schemaVersion,
        migration: JSON.stringify(migration),
      });

      const { changes, timestamp } = data as {
        changes: SyncDatabaseChangeSet;
        timestamp: number;
      };

      return { changes, timestamp };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      console.log('🍉 PUSH CHANGES');

      console.log({ changes });

      await api.syncPushChanges({
        changes: {
          tasks: {
            created: changes.tasks?.created.map((task) => ({
              id: task.id,
              name: task.name,
              icon: task.icon,
              is_done: task.is_done,
              is_urgent: task.is_urgent,
              comment: task.comment,
              created_at: task.created_at,
              updated_at: task.updated_at,
            })),
            updated: changes.tasks?.updated.map((task) => ({
              id: task.id,
              name: task.name,
              icon: task.icon,
              is_done: task.is_done,
              is_urgent: task.is_urgent,
              comment: task.comment,
              created_at: task.created_at,
              updated_at: task.updated_at,
            })),
            deleted: changes.tasks?.deleted,
          },
        },
        lastPulledAt,
      });
    },
  });
};
