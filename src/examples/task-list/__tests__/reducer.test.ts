import reducer, { initialState, Task } from '../reducer';
import * as actions from '../actions';

let id = 0;
const uuid = () => id++;

describe('task-list reducer', () => {
  const createTask = <T>(patch?: T): Task => ({
    id: uuid(),
    description: 'Write a real description',
    completed: false,
    ...patch,
  });

  it('returns state for unknown actions', () => {
    const state = reducer(undefined, { type: '@@init' });

    expect(state).toBe(initialState);
  });

  describe('addTask(...)', () => {
    it('appends a new task', () => {
      const task = createTask({ description: 'brew more coffee' });
      const action = actions.addTask(task);
      const state = reducer(undefined, action);

      expect(state.tasks).toEqual([task]);
    });
  });

  describe('moveTask(...)', () => {
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
      const action = actions.moveTask({ origin: 2, destination: 1 });
      const state = reducer(startingPoint, action);

      expect(state.tasks).toEqual([first, third, second, fourth]);
    });
  });

  describe('finishTask(...)', () => {
    it('marks the task completed', () => {
      const startingPoint = {
        ...initialState,
        tasks: [createTask({ description: 'save the pandas' })],
      };

      const [task] = startingPoint.tasks;
      const action = actions.finishTask(task.id);
      const state = reducer(startingPoint, action);

      expect(state.tasks).toEqual([{ ...task, completed: true }]);
    });
  });

  describe('unfinishTask(...)', () => {
    it('reverts to the uncompleted state', () => {
      const startingPoint = {
        ...initialState,
        tasks: [createTask({ completed: true })],
      };

      const [task] = startingPoint.tasks;
      const action = actions.unfinishTask(task.id);
      const state = reducer(startingPoint, action);

      expect(state.tasks).toEqual([{ ...task, completed: false }]);
    });
  });

  describe('removeTask(...)', () => {
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
      const action = actions.removeTask(second.id);
      const state = reducer(startingPoint, action);

      expect(state.tasks).toEqual([first, third]);
    });
  });

  describe('clearCompleted', () => {
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
      const state = reducer(startingPoint, actions.clearCompleted());

      expect(state.tasks).toEqual([inProgressTask]);
    });
  });
});
