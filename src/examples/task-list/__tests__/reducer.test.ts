import reducer, { initialState, Task, TaskView } from '../reducer';
import * as tasks from '../actions';

let id = 0;
const uuid = () => id++;

describe('task-list reducer', () => {
  const createTask = <T>(patch?: T): Task => ({
    id: uuid(),
    description: 'Write a real description',
    completed: false,
    ...patch,
  });

  describe('create(...)', () => {
    it('appends a new task', () => {
      const task = createTask({ description: 'brew more coffee' });
      const action = tasks.create(task);
      const state = reducer(undefined, action);

      expect(state.tasks).toEqual([task]);
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
      const action = tasks.move({ origin: 2, target: 1 });
      const state = reducer(startingPoint, action);

      expect(state.tasks).toEqual([first, third, second, fourth]);
    });
  });

  describe('markComplete(...)', () => {
    it('marks the task completed', () => {
      const startingPoint = {
        ...initialState,
        tasks: [createTask({ description: 'save the pandas' })],
      };

      const [task] = startingPoint.tasks;
      const action = tasks.markComplete(task.id);
      const state = reducer(startingPoint, action);

      expect(state.tasks).toEqual([{ ...task, completed: true }]);
    });
  });

  describe('markIncomplete(...)', () => {
    it('reverts to the uncompleted state', () => {
      const startingPoint = {
        ...initialState,
        tasks: [createTask({ completed: true })],
      };

      const [task] = startingPoint.tasks;
      const action = tasks.markIncomplete(task.id);
      const state = reducer(startingPoint, action);

      expect(state.tasks).toEqual([{ ...task, completed: false }]);
    });
  });

  describe('remove(...)', () => {
    it('removes the task', () => {
      const startingPoint = {
        ...initialState,
        tasks: [
          createTask({ description: 'recommend rust to more strangers' }),
          createTask({ description: 'start 3 new projects' }),
          createTask({ description: 'abandon those 3 new projects' }),
        ],
      };

      const [first, second, third] = startingPoint.tasks;
      const action = tasks.remove(second.id);
      const state = reducer(startingPoint, action);

      expect(state.tasks).toEqual([first, third]);
    });
  });

  describe('clearCompleted(...)', () => {
    it('removes all completed tasks', () => {
      const startingPoint = {
        ...initialState,
        tasks: [
          createTask({ completed: true, description: 'learn karate' }),
          createTask({ completed: false, description: 'master the piano' }),
          createTask({ completed: true, description: 'get out of bed' }),
        ],
      };

      const inProgressTask = startingPoint.tasks[1];
      const state = reducer(startingPoint, tasks.clearCompleted());

      expect(state.tasks).toEqual([inProgressTask]);
    });
  });

  describe('clearAll(...)', () => {
    it('removes all the tasks', () => {
      const startingPoint = {
        ...initialState,
        tasks: [
          createTask({ description: 'feed the penguins' }),
          createTask({ description: 'learn to yodel' }),
          createTask({ description: 'increase carbon emissions' }),
        ],
      };

      const state = reducer(startingPoint, tasks.clearAll());

      expect(state).toEqual(initialState);
    });
  });

  describe('changeView(...)', () => {
    it('updates the active filter', () => {
      const action = tasks.changeView(TaskView.Complete);
      const state = reducer(undefined, action);

      expect(state.view).toBe(TaskView.Complete);
    });
  });
});
