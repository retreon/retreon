import { createStore, applyMiddleware } from 'redux';

import middleware from '../async-generator-middleware';

describe('Redux middleware', () => {
  const setup = () => {
    const reducer = jest.fn(state => state);
    const store = createStore(reducer, applyMiddleware(middleware));
    jest.spyOn(store, 'dispatch');

    return {
      store,
      reducer,
    };
  };

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

  // Actions should never be dispatched back-to-back. Handle the same action
  // in different reducers instead.
  it('ignores synchronous iterators', () => {
    const { store, reducer } = setup();

    function* action() {
      yield { type: 'should-not-dispatch' };
      return 'no';
    }

    const fail = () => store.dispatch(action() as any);
    expect(fail).toThrow(/plain objects/i);
    expect(reducer).toHaveBeenCalledTimes(1);
  });
});
