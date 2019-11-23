import createAction from '../create-action';
import getActionType from '../get-action-type';

describe('getActionType', () => {
  it('returns the action type', () => {
    const actionType = 'action-type';
    const action = createAction(actionType, () => null);

    expect(getActionType(action)).toBe(actionType);
  });

  it('returns the input if given a string', () => {
    expect(getActionType('input')).toBe('input');
  });

  it('returns the input if given a symbol', () => {
    const id = Symbol('fake action type');

    expect(getActionType(id)).toBe(id);
  });

  // redux-actions only implements `toString()`.
  it('survives if the action creator only implements string coercion', () => {
    const action = () => {};
    action.toString = () => 'yo';

    expect(getActionType(action as any)).toBe('yo');
  });

  it('blows up if you try to pass an unsupported type', () => {
    expect(() => getActionType(null as any)).toThrow(/expected/i);
    expect(() => getActionType(undefined as any)).toThrow(/expected/i);
  });
});
