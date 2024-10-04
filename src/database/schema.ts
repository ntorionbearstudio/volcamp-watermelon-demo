import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'tasks',
      columns: [
        { name: 'icon', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'is_done', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'is_urgent', type: 'boolean', isOptional: true },
        { name: 'comment', type: 'string', isOptional: true },
      ],
    }),
  ],
});
