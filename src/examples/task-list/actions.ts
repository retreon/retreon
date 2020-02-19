import { createAction } from '../../index';
import { Task } from './reducer';

export const addTask = createAction<Task>('tasks/add');
export const removeTask = createAction<Task['id']>('task/remove');
export const moveTask = createAction<{
  origin: Task['id'];
  destination: number;
}>('tasks/move');

export const finishTask = createAction<Task['id']>('tasks/finishTask');
export const unfinishTask = createAction<Task['id']>('tasks/unfinishTask');
export const clearCompleted = createAction('tasks/clear-completed');
