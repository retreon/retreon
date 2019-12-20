import createReducer from '../create-reducer';
import createAction from '../create-action';
import { failure } from '../action-failure';

describe('createReducer', () => {
  it('returns a reducer', () => {
    const reducer = createReducer(null, () => []);

    expect(reducer).toEqual(expect.any(Function));
  });

  it('returns the initial state on first run', () => {
    const initialState = { initial: 'state' };
    const reducer = createReducer(initialState, () => []);

    const state = reducer(undefined, { type: '@@init' });

    expect(state).toBe(initialState);
  });

  it('returns the current state if state already exists', () => {
    const reducer = createReducer(1, () => []);
    const state = reducer(5, { type: 'random' });

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
  });
});
