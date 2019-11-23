import createAction from '../create-action';
import { failure } from '../action-failure';

describe('createAction', () => {
  it('returns an action creator', () => {
    const doTheThing = createAction('the-thing', () => 'payload');

    expect(doTheThing).toEqual(expect.any(Function));
    expect(doTheThing()).toEqual({ type: 'the-thing', payload: 'payload' });
  });

  it('coerces to the action type', () => {
    const increment = createAction('increment', () => null);

    expect(String(increment)).toBe('increment');
  });

  it('returns an error type if given a failure', () => {
    const doTheThing = createAction('effect', () => failure('nope'));

    expect(doTheThing()).toEqual({
      type: 'effect',
      error: true,
      payload: 'nope',
    });
  });
});
