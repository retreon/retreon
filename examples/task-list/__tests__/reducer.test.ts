import { createStore, applyMiddleware } from 'redux';
import { middleware } from 'retreon';

import reducer, { initialState, Task, TaskView } from '../reducer';
import * as tasks from '../actions';

let id = 0;
const uuid = () => id++;

describe('task-list reducer', () => {
  const setup = <State extends typeof initialState>(state?: State) => {
    const enhancer = applyMiddleware(middleware);
    return createStore(reducer, state, enhancer);
  };

  const createTask = <T>(patch?: T): Task => ({
    id: uuid(),
    description: 'Write a real description',
    completed: false,
    ...patch,
  });

  describe('create(...)', () => {
    it('appends a new task', () => {
      const store = setup();
      const task = createTask({ description: 'brew more coffee' });
      store.dispatch(tasks.create(task));

      expect(store.getState()).toHaveProperty('tasks', [task]);
    });
  });

  describe('move(...)', () => {
    it('moves the task to a different index', () => {
      const startingPoint = {
        ...initialState,
        tasks: [
          createTask({ description: 'run a 30k' }),
          createTask({ description: 'eat a taco' }),
          createTask({ description: 'revive cobol' }),
          createTask({ description: 'invent time travel' }),
        ],
      };

      const [first, second, third, fourth] = startingPoint.tasks;
      const store = setup(startingPoint);
      store.dispatch(tasks.move({ origin: 2, target: 1 }));

      expect(store.getState()).toHaveProperty('tasks', [
        first,
        third,
        second,
        fourth,
      ]);
    });
  });

  describe('markComplete(...)', () => {
    it('marks the task completed', () => {
      const task = createTask({ description: 'save the pandas' });
      const store = setup({ ...initialState, tasks: [task] });

      store.dispatch(tasks.markComplete(task.id));

      expect(store.getState()).toHaveProperty('tasks', [
        { ...task, completed: true },
      ]);
    });
  });

  describe('markIncomplete(...)', () => {
    it('reverts to the uncompleted state', () => {
      const task = createTask({ completed: true });
      const store = setup({
        ...initialState,
        tasks: [task],
      });

      store.dispatch(tasks.markIncomplete(task.id));

      expect(store.getState()).toHaveProperty('tasks', [
        { ...task, completed: false },
      ]);
    });
  });

  describe('remove(...)', () => {
    it('removes the task', () => {
      const [first, second, third] = [
        createTask({ description: 'recommend rust to more strangers' }),
        createTask({ description: 'start 3 new projects' }),
        createTask({ description: 'abandon those 3 new projects' }),
      ];

      const store = setup({
        ...initialState,
        tasks: [first, second, third],
      });

      store.dispatch(tasks.remove(second.id));

      expect(store.getState()).toHaveProperty('tasks', [first, third]);
    });
  });

  describe('clearCompleted(...)', () => {
    it('removes all completed tasks', () => {
      const taskList = [
        createTask({ completed: true, description: 'learn karate' }),
        createTask({ completed: false, description: 'master the piano' }),
        createTask({ completed: true, description: 'get out of bed' }),
      ];

      const store = setup({ ...initialState, tasks: taskList });
      store.dispatch(tasks.clearCompleted());

      expect(store.getState()).toHaveProperty('tasks', [taskList[1]]);
    });
  });

  describe('clearAll(...)', () => {
    it('removes all the tasks', () => {
      const store = setup({
        ...initialState,
        tasks: [
          createTask({ description: 'feed the penguins' }),
          createTask({ description: 'learn to yodel' }),
          createTask({ description: 'increase carbon emissions' }),
        ],
      });

      store.dispatch(tasks.clearAll());

      expect(store.getState()).toEqual(initialState);
    });
  });

  describe('changeView(...)', () => {
    it('updates the active filter', () => {
      const store = setup();
      store.dispatch(tasks.changeView(TaskView.Complete));

      expect(store.getState()).toHaveProperty('view', TaskView.Complete);
    });
  });
});
