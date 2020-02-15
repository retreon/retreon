import { nothing } from 'immer';

import createReducer from '../create-reducer';
import createAction from '../create-action';
import { failure } from '../action-failure';
import { expectType } from '../types/assertions';

describe('createReducer', () => {
  it('returns a reducer', () => {
    const reducer = createReducer(null, () => []);

    expect(reducer).toEqual(expect.any(Function));
  });

  it('returns the initial state on first run', () => {
    const initialState = { initial: 'state' };
    const reducer = createReducer(initialState, () => []);

    const state = reducer(undefined, { type: '@@init' });

    expectType<{ initial: string }>(state);
    expect(state).toBe(initialState);
  });

  it('returns the current state if state already exists', () => {
    const reducer = createReducer(1, () => []);
    const state = reducer(5, { type: 'random' });

    expectType<number>(state);
    expect(state).toBe(5);
  });

  describe('handleAction', () => {
    it('calls the action reducer when it matches', () => {
      const increment = createAction('increment', () => 'yo');
      const actionReducer = jest.fn();

      const reducer = createReducer(0, handleAction => [
        handleAction(increment, actionReducer),
      ]);

      const action = increment();
      reducer(undefined, action);
      expect(actionReducer).toHaveBeenCalledWith(0, action.payload);
    });

    it('ignores action errors', () => {
      const unstable = createAction('unstable', (fail: boolean) => {
        if (fail) return failure('Testing failures');
        return true;
      });

      const onSuccess = jest.fn();
      const onFailure = jest.fn();

      const reducer = createReducer(0, handleAction => [
        handleAction(unstable, onSuccess),
        handleAction.error(unstable, onFailure),
      ]);

      reducer(undefined, unstable(true));

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onFailure).toHaveBeenCalled();
    });

    it('proxies mutation through immer', () => {
      const increment = createAction('increment');

      const initialState = { count: 0 };
      const reducer = createReducer(initialState, handleAction => [
        handleAction(increment, state => {
          state.count += 1;
        }),

        handleAction(increment, state => {
          state.count += 1;
        }),
      ]);

      const state = reducer(undefined, increment());

      // No mutation.
      expect(initialState).toEqual({ count: 0 });
      expect(state).toEqual({ count: 2 });
    });

    it('replaces the value when something is returned', () => {
      const initialState = 0;
      const reset = createAction('reset');

      const reducer = createReducer(initialState, handleAction => [
        handleAction(reset, () => initialState),
      ]);

      const state = reducer(10, reset());

      expect(state).toBe(0);
    });

    it('wipes out the value when returning "nothing"', () => {
      const reset = createAction('reset');
      const initialState: void | number = 0;

      const reducer = createReducer(initialState, handleAction => [
        handleAction(reset, () => nothing),
      ]);

      const state = reducer(10, reset());

      expect(state).toBe(undefined);
    });

    it('infers state and payload types', () => {
      const add = createAction('add', (value: string) => value);

      createReducer(0, handleAction => [
        handleAction(add, (state, value) => {
          expectType<number>(state);
          expectType<string>(value);
        }),
      ]);
    });
  });

  describe('handleAction.error', () => {
    it('is called for errors', () => {
      const unstable = createAction('unstable', (fail: boolean) => {
        if (fail) return failure('Testing failures');
        return true;
      });

      const onSuccess = jest.fn();
      const onFailure = jest.fn();

      const reducer = createReducer(0, handleAction => [
        handleAction(unstable, onSuccess),
        handleAction.error(unstable, onFailure),
      ]);

      reducer(undefined, unstable(false));

      expect(onSuccess).toHaveBeenCalled();
      expect(onFailure).not.toHaveBeenCalled();
    });

    it('infers error types', () => {
      const die = createAction('type', () => failure('content'));

      createReducer(0, handleAction => [
        handleAction(die, (state, error) => {
          expectType<number>(state);
          expectType<string>(error);
        }),
      ]);
    });
  });
});
