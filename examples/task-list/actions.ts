import { createAction } from 'retreon';

import { Task, TaskView } from './reducer';

export const create = createAction<Task>('tasks/create');
export const remove = createAction<Task['id']>('tasks/remove');
export const move = createAction<{ origin: number; target: number }>(
  'tasks/move',
);

export const markComplete = createAction<Task['id']>('tasks/mark-complete');
export const markIncomplete = createAction<Task['id']>('tasks/mark-incomplete');

export const clearCompleted = createAction('tasks/clear-completed');
export const clearAll = createAction('tasks/clear-all');

export const changeView = createAction<TaskView>('tasks/change-view');
