import { createReducer } from '../../index';
import * as actions from './actions';

type State = {
  tasks: Array<Task>;
};

export type Task = {
  id: number;
  description: string;
  completed: boolean;
};

export const initialState: State = {
  tasks: [],
};

export default createReducer(initialState, handleAction => [
  handleAction(actions.addTask, (state, task) => {
    state.tasks.push(task);
  }),

  handleAction(actions.moveTask, (state, { origin, destination }) => {
    const [task] = state.tasks.splice(origin, 1);
    state.tasks.splice(destination, 0, task);
  }),

  handleAction(actions.finishTask, (state, taskId) => {
    const task = state.tasks.find(task => task.id === taskId);
    if (task) task.completed = true;
  }),

  handleAction(actions.unfinishTask, (state, taskId) => {
    const task = state.tasks.find(task => task.id === taskId);
    if (task) task.completed = false;
  }),

  handleAction(actions.removeTask, (state, taskId) => {
    state.tasks = state.tasks.filter(task => task.id !== taskId);
  }),

  handleAction(actions.clearCompleted, state => {
    state.tasks = state.tasks.filter(task => !task.completed);
  }),
]);
