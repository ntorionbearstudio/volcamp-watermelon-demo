import { Model } from '@nozbe/watermelondb'
import { date, field, text, writer } from '@nozbe/watermelondb/decorators'

export default class Task extends Model {
  static table = 'tasks'

  @text('icon') icon!: string;
  @text('name') name!: string;
  @field('is_done') isDone!: boolean;

  @date('created_at')
  createdAt?: Date;
  @date('updated_at')
  updatedAt?: Date;

  @writer async markAsDone() {
    await this.update(task => {
      task.isDone = true
    })
  }

  @writer async markAsUndone() {
    await this.update(task => {
      task.isDone = false
    })
  }
}

