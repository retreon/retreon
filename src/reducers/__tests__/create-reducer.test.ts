import { nothing } from 'immer';
import { createStore, applyMiddleware } from 'redux';

import { createReducer, createAction } from '../../index';
import { expectType } from '../../types/assertions';
import forgeAction from '../../utils/forge-action';
import generatorMiddleware from '../../middleware/generator-middleware';
import { mixin } from '../../utils/errors';

describe('createReducer', () => {
  class KnownError extends mixin(Error) {}

  const setup = <F extends (...args: any[]) => any, S>(
    reducer: F,
    state?: S,
  ) => {
    const middleware = applyMiddleware(generatorMiddleware);
    return createStore(reducer, state, middleware);
  };

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

  // Gracefully survives circular imports between actions and reducers.
  it('lazily instantiates the action-reducer mappings', () => {
    const factory = jest.fn(() => []);
    const reducer = createReducer(1, factory);

    expect(factory).not.toHaveBeenCalled();
    reducer(undefined, { type: '@@init' });
    expect(factory).toHaveBeenCalled();
  });

  it('provides fast feedback if the factory function is invalid', () => {
    const fail = () => createReducer(0, undefined as any);

    expect(fail).toThrow(/expects a function/i);
  });

  it('complains if the return value is not an array', () => {
    const fail = () => {
      const reducer = createReducer(null, jest.fn());
      reducer(undefined, { type: '@@init' });
    };

    expect(fail).toThrow(/list/);
  });

  describe('handleAction', () => {
    it('calls the action reducer when it matches', () => {
      const increment = createAction('increment', () => 'yo');
      const actionReducer = jest.fn();

      const reducer = createReducer(0, (handleAction) => [
        handleAction(increment, actionReducer),
      ]);

      const store = setup(reducer);
      const payload = store.dispatch(increment());

      expect(actionReducer).toHaveBeenCalledWith(0, payload);
    });

    it('ignores action errors', () => {
      const fail = createAction('fail', () => {
        throw new KnownError('Testing failures');
      });

      const onSuccess = jest.fn();
      const onFailure = jest.fn();

      const reducer = createReducer(0, (handleAction) => [
        handleAction(fail, onSuccess),
        handleAction.error(fail, onFailure),
      ]);

      const store = setup(reducer);
      store.dispatch(fail());

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onFailure).toHaveBeenCalled();
    });

    it('proxies mutation through immer', () => {
      const increment = createAction('increment');

      const initialState = { count: 0 };
      const reducer = createReducer(initialState, (handleAction) => [
        handleAction(increment, (state) => {
          state.count += 1;
        }),

        handleAction(increment, (state) => {
          state.count += 1;
        }),
      ]);

      const store = setup(reducer);
      store.dispatch(increment());

      // No mutation.
      expect(initialState).toEqual({ count: 0 });
      expect(store.getState()).toEqual({ count: 2 });
    });

    it('replaces the value when something is returned', () => {
      const initialState = 0;
      const reset = createAction('reset');

      const reducer = createReducer(initialState, (handleAction) => [
        handleAction(reset, () => initialState),
      ]);

      const store = setup(reducer, 10);
      store.dispatch(reset());

      expect(store.getState()).toBe(0);
    });

    it('wipes out the value when returning "nothing"', () => {
      const reset = createAction('reset');
      const initialState: void | number = 0;

      const reducer = createReducer(initialState, (handleAction) => [
        handleAction(reset, () => nothing),
      ]);

      const store = setup(reducer, 10);
      store.dispatch(reset());

      expect(store.getState()).toBe(undefined);
    });

    it('infers state and payload types', () => {
      const add = createAction('add', (value: string) => value);

      createReducer(0, (handleAction) => [
        handleAction(add, (state, value) => {
          expectType<number>(state);
          expectType<string>(value);
        }),
      ]);
    });

    it('supports binding reducers to action factory types', () => {
      const factory = createAction.factory<string>('explicit');

      const reducer = createReducer('', (handleAction) => [
        handleAction(factory, (_state, payload) => {
          return payload;
        }),
      ]);

      const state = reducer(undefined, factory.success('called'));

      expect(state).toBe('called');
    });
  });

  describe('handleAction.error', () => {
    it('is called for errors', () => {
      const fail = createAction('fail', () => {
        throw new KnownError('Testing failures');
      });

      const onSuccess = jest.fn();
      const onFailure = jest.fn();

      const reducer = createReducer(0, (handleAction) => [
        handleAction(fail, onSuccess),
        handleAction.error(fail, onFailure),
      ]);

      const store = setup(reducer);
      store.dispatch(fail());

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onFailure).toHaveBeenCalled();
    });

    it('is not called for success conditions', () => {
      const win = createAction('win', () => true);

      const onSuccess = jest.fn();
      const onFailure = jest.fn();

      const reducer = createReducer(0, (handleAction) => [
        handleAction(win, onSuccess),
        handleAction.error(win, onFailure),
      ]);

      const store = setup(reducer);
      store.dispatch(win());

      expect(onSuccess).toHaveBeenCalled();
      expect(onFailure).not.toHaveBeenCalled();
    });
  });

  describe('handleAction.optimistic', () => {
    it('gets called for optimistic actions', () => {
      const later = createAction.async('later', async () => {});
      const handler = jest.fn();

      const reducer = createReducer(0, (handleAction) => [
        handleAction.optimistic(later, handler),
      ]);

      const action = forgeAction.optimistic(later, undefined);
      reducer(undefined, action);

      expect(handler).toHaveBeenCalledWith(0, undefined);
    });

    it('passes the payload', () => {
      const later = createAction.async('yolo', async (n: number) => String(n));
      const reducer = createReducer(0, (handleAction) => [
        handleAction.optimistic(later, (state, value) => {
          expectType<number>(state);
          expectType<number>(value);
          return value;
        }),
      ]);

      const action = forgeAction.optimistic(later, 10);
      const state = reducer(undefined, action);

      expect(state).toBe(10);
    });
  });
});
