import { createReducer } from '../../index';
import * as tasks from './actions';

type State = {
  tasks: Array<Task>;
  view: TaskView;
};

export type Task = {
  id: number;
  description: string;
  completed: boolean;
};

export enum TaskView {
  All = 'all',
  Complete = 'complete',
  Incomplete = 'incomplete',
}

export const initialState: State = {
  view: TaskView.All,
  tasks: [],
};

export default createReducer(initialState, (handleAction) => [
  handleAction(tasks.create, (state, task) => {
    state.tasks.push(task);
  }),

  handleAction(tasks.move, (state, { origin, target }) => {
    const [task] = state.tasks.splice(origin, 1);
    state.tasks.splice(target, 0, task);
  }),

  handleAction(tasks.markComplete, (state, taskId) => {
    const task = state.tasks.find((task) => task.id === taskId);
    if (task) task.completed = true;
  }),

  handleAction(tasks.markIncomplete, (state, taskId) => {
    const task = state.tasks.find((task) => task.id === taskId);
    if (task) task.completed = false;
  }),

  handleAction(tasks.remove, (state, taskId) => {
    state.tasks = state.tasks.filter((task) => task.id !== taskId);
  }),

  handleAction(tasks.clearCompleted, (state) => {
    state.tasks = state.tasks.filter((task) => !task.completed);
  }),

  handleAction(tasks.clearAll, () => {
    return initialState;
  }),

  handleAction(tasks.changeView, (state, filter) => {
    state.view = filter;
  }),
]);
