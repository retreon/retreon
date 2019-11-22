import createReducer from '../create-reducer';

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
});
