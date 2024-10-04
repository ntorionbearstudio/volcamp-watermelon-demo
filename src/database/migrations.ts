import {
  addColumns,
  schemaMigrations,
} from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: 'tasks',
          columns: [
            { name: 'is_urgent', type: 'boolean', isOptional: true },
            { name: 'comment', type: 'string', isOptional: true },
          ],
        }),
      ],
    },
  ],
});
