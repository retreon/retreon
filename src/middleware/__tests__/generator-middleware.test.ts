import { createStore, applyMiddleware } from 'redux';

import middleware from '../generator-middleware';
import { expectType } from '../../types/assertions';

describe('Redux middleware', () => {
  const setup = () => {
    const reducer = jest.fn((state) => state);
    const store = createStore(reducer, applyMiddleware(middleware));
    jest.spyOn(store, 'dispatch');

    return {
      store,
      reducer,
    };
  };

  describe('async iterator', () => {
    it('dispatches every yielded value', async () => {
      const { store, reducer } = setup();

      async function* action() {
        yield { type: 'first' };
        yield { type: 'second' };
      }

      await store.dispatch(action());

      expect(reducer).toHaveBeenCalledTimes(3); // Includes the @init action.
      expect(reducer).toHaveBeenCalledWith(undefined, { type: 'first' });
      expect(reducer).toHaveBeenCalledWith(undefined, { type: 'second' });
    });

    it('resolves with the iterator return value', async () => {
      const { store } = setup();
      const resolveValue = 10;

      async function* action() {
        yield { type: 'first' };
        return resolveValue;
      }

      const result = await store.dispatch(action());

      expectType<number>(result);
      expect(result).toBe(resolveValue);
    });

    it('resumes execution with the dispatch return value', async () => {
      const { store } = setup();

      async function* action() {
        const action = { type: 'dispatch-me' };
        expect(yield action).toEqual(action);
      }

      await store.dispatch(action());
    });
  });

  describe('sync iterator', () => {
    it('dispatches every yielded value', () => {
      const { store, reducer } = setup();

      function* action() {
        yield { type: 'first' };
        yield { type: 'second' };
      }

      store.dispatch(action());

      expect(reducer).toHaveBeenCalledTimes(3); // Includes the @init action.
      expect(reducer).toHaveBeenCalledWith(undefined, { type: 'first' });
      expect(reducer).toHaveBeenCalledWith(undefined, { type: 'second' });
    });

    it('returns the iterator return value from dispatch', () => {
      const { store } = setup();

      function* action() {
        yield { type: 'action' };
        return '9,000% APY';
      }

      const result = store.dispatch(action());
      expect(result).toBe('9,000% APY');
    });

    it('resumes execution with the dispatched result', () => {
      const { store } = setup();

      function* action() {
        const action = { type: 'action' };
        expect(yield action).toEqual(action);
      }

      store.dispatch(action());
    });
  });
});
