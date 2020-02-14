import createAction from '../create-action';
import { failure } from '../action-failure';
import { expectType, expectNotType } from '../types/assertions';

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

  // Other parameters reserved for future use. Pass an object instead.
  it('only passes the first parameter', () => {
    const effect = jest.fn();
    const increment = createAction('increment', effect);

    (increment as any)(1, null);

    expect(effect).toHaveBeenCalledWith(1);
  });

  it('always uses an undefined payload if no effect is provided', () => {
    const increment = createAction('increment');

    expect(increment()).toEqual({
      type: 'increment',
    });
  });

  describe('type', () => {
    it('infers that payloads are missing in void actions', () => {
      const increment = createAction('increment');
      const action = increment();

      expectNotType<{ payload: any }, typeof action>(action);
    });

    it('infers the payload type returned from effects', () => {
      const simple = createAction('simple', () => 'content');
      const action = simple();

      expectType<string>(action.payload);
    });

    it('infers error types from effect return types', () => {
      const fail = createAction('failure', () => failure(1337));
      const action = fail();

      expectType<number>(action.payload);
      expectType<{ error: true }>(action);
    });

    it('infers union types for possible failures', () => {
      const mixed = createAction('mixed-result', () => {
        if (Math.random() >= 0.5) return failure(1);
        return 'or a string';
      });

      const args: Parameters<typeof mixed> = [];
      const action = mixed(...args);

      if (action.error === true) {
        expectType<number>(action.payload);
      } else {
        expectType<string>(action.payload);
      }
    });

    it('infers required argument types', () => {
      const requiredArg = createAction('type', (value: string) => value);

      const args: Parameters<typeof requiredArg> = ['hello world'];
      const action = requiredArg(...args);
      expectType<string>(action.payload);
    });

    it('only exposes one parameter from the effect', () => {
      const requiredArg = createAction('type', (_: string, n: number) => n);

      const args: Parameters<typeof requiredArg> = ['hello world'];
      const action = requiredArg(...args);
      expectType<number>(action.payload);
    });
  });
});
