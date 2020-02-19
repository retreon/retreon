import reducer from '../reducer';
import * as counter from '../actions';

describe('Counter reducer', () => {
  describe('increment(...)', () => {
    it('increments the count', () => {
      const state = reducer(5, counter.increment());

      expect(state).toBe(6);
    });
  });

  describe('decrement(...)', () => {
    it('decrements the count', () => {
      const state = reducer(5, counter.decrement());

      expect(state).toBe(4);
    });
  });
});
