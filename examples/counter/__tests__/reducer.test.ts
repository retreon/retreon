import { createStore, applyMiddleware } from 'redux';
import { middleware } from 'retreon';

import reducer from '../reducer';
import * as counter from '../actions';

describe('Counter reducer', () => {
  const setup = () => createStore(reducer, applyMiddleware(middleware));

  describe('increment(...)', () => {
    it('increments the count', () => {
      const store = setup();

      expect(store.getState()).toBe(0);
      store.dispatch(counter.increment());
      expect(store.getState()).toBe(1);
    });
  });

  describe('decrement(...)', () => {
    it('decrements the count', () => {
      const store = setup();

      expect(store.getState()).toBe(0);
      store.dispatch(counter.decrement());
      expect(store.getState()).toBe(-1);
    });
  });
});
