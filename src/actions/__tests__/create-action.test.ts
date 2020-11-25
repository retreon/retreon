import createAction from '../create-action';
import { expectType, expectNotType } from '../../types/assertions';
import Phase from '../../constants/phase';
import {
  OptimisticAction,
  ActionSuccess,
  ActionFailure,
  VoidAction,
} from '../../types/actions';
import {
  isActionSuccess,
  isActionFailure,
  isOptimisticAction,
} from '../../utils/action-variant';
import { mixin } from '../../utils/errors';

describe('createAction', () => {
  it('returns an action creator', () => {
    const doTheThing = createAction('the-thing', () => 'payload');

    expect(doTheThing).toEqual(expect.any(Function));

    expect(Array.from(doTheThing())).toEqual([
      { type: 'the-thing', payload: 'payload' },
    ]);
  });

  it('coerces to the action type', () => {
    const increment = createAction('increment', () => null);

    expect(String(increment)).toBe('increment');
  });

  it('goes kaboom if the action type is not a string', () => {
    const fail = () => createAction(Symbol('not allowed') as any);

    expect(fail).toThrow(/action.type/i);
  });

  it('yields an error type if the effect throws', () => {
    class KnownError extends mixin(Error) {}
    const error = new KnownError('testing known effect errors');

    const doTheThing = createAction('effect', () => {
      throw error;
    });

    expect(Array.from(doTheThing())).toEqual([
      {
        type: 'effect',
        error: true,
        payload: error,
      },
    ]);
  });

  it('returns the error type for recognized errors', () => {
    class KnownError extends mixin(Error) {}
    const error = new KnownError('testing known effect errors');

    const doTheThing = createAction('effect', () => {
      throw error;
    });

    const iterator = doTheThing();

    // First yield is the action, last is the return value.
    expect(iterator.next().value).toEqual(iterator.next().value);
  });

  it('re-throws unrecognized errors', () => {
    const error = new Error('testing unknown effect errors');
    const doTheThing = createAction('effect', () => {
      throw error;
    });

    const iterator = doTheThing();
    expect(iterator.next().value).toEqual({
      type: 'effect',
      error: true,
      payload: error,
    });

    expect(() => iterator.next()).toThrow(error);
  });

  // Other parameters reserved for future use. Pass an object instead.
  it('only passes the first parameter', () => {
    const effect = jest.fn();
    const increment = createAction('increment', effect);

    Array.from((increment as any)(1, null));

    expect(effect).toHaveBeenCalledWith(1);
  });

  it('uses an undefined payload if no effect is provided', () => {
    const increment = createAction('increment');
    const [action] = Array.from(increment());

    expectType<VoidAction>(action);
    expect(action).toEqual({
      type: 'increment',
    });
  });

  it('uses the argument as payload when no effect was provided', () => {
    const increment = createAction<string>('action-type');
    const args: Parameters<typeof increment> = ['some content'];
    const [action] = Array.from(increment(...args));

    expectType<string>(action.payload);
    expect(action.payload).toBe(args[0]);
  });

  describe('type', () => {
    it('infers that payloads are missing in void actions', () => {
      const increment = createAction('increment');
      const [action] = Array.from(increment());

      expectNotType<{ payload: any }, typeof action>(action);
    });

    it('infers the payload type returned from effects', () => {
      const simple = createAction('simple', () => 'content');
      const [action] = Array.from(simple());

      if (action.error === true) {
        expectType<unknown>(action.payload);
      } else {
        expectType<string>(action.payload);
      }
    });

    it('infers required argument types', () => {
      const requiredArg = createAction('type', (value: string) => value);

      const args: Parameters<typeof requiredArg> = ['hello world'];
      const [action] = Array.from(requiredArg(...args));

      if (action.error !== true) {
        expectType<string>(action.payload);
      }
    });

    it('only exposes one parameter from the effect', () => {
      const requiredArg = createAction('type', (_: string, n: number) => n);

      const args: Parameters<typeof requiredArg> = ['hello world'];
      const [action] = Array.from(requiredArg(...args));

      if (action.error !== true) {
        expectType<number>(action.payload);
      }
    });

    it('infers all major action branch types', () => {
      const voidAction = createAction('void');
      const unfailingAction = createAction<string>('unfailing');
      const uncertainAction = createAction('type', () => 5);

      expectType<Generator<VoidAction, void>>(voidAction());

      expectType<Generator<ActionSuccess<string>, string>>(
        unfailingAction('t'),
      );

      expectType<
        Generator<ActionSuccess<number> | ActionFailure<unknown>, number>
      >(uncertainAction());
    });
  });

  describe('.async(...)', () => {
    it('returns an async generator', async () => {
      const later = createAction.async('later', async () => 'result');
      const result = later();

      expectType<AsyncGenerator<any, string>>(result);
    });

    it('coerces to the action constant', () => {
      const actionType = 'yolo';
      const later = createAction.async(actionType, async () => {});

      expect(String(later)).toEqual(actionType);
    });

    it('dies if the action type is not a string', () => {
      const fail = () => createAction.async(Symbol() as any, async () => {});

      expect(fail).toThrow(/action.type/i);
    });

    it('dispatches actions when created and after finishing', async () => {
      const resolveValue = 'async function return value';
      const later = createAction.async('later', async () => resolveValue);
      const result = later();

      await expect(result.next()).resolves.toEqual({
        done: false,
        value: {
          type: String(later),
          meta: { phase: Phase.Optimistic },
        },
      });

      await expect(result.next()).resolves.toEqual({
        done: false,
        value: {
          type: String(later),
          payload: resolveValue,
        },
      });

      await expect(result.next()).resolves.toEqual({
        done: true,
        value: resolveValue,
      });
    });

    it('includes action input as the optimistic payload', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const later = createAction.async('later', async (_msg: string) => null);
      const iterator = later('action input');

      await expect(iterator.next()).resolves.toEqual({
        done: false,
        value: {
          type: String(later),
          payload: 'action input',
          meta: { phase: Phase.Optimistic },
        },
      });
    });

    it('infers the action types', async () => {
      const later = createAction.async('later', async () => 'value');
      const iterator = later();
      const next = await iterator.next();

      if (next.done === false) {
        const action = next.value;
        if (isOptimisticAction(action)) {
          expectType<OptimisticAction<void>>(action);
        }

        if (isActionSuccess(action)) {
          expectType<ActionSuccess<string>>(action);
        }
      }
    });

    it('infers the optimistic action type from the effect parameter', async () => {
      const later = createAction.async('later', async (t: string) => Number(t));
      const iterator = later('200');
      const next = await iterator.next();

      if (next.done === false) {
        const action = next.value;
        if (isOptimisticAction(action)) {
          expectType<OptimisticAction<string>>(action);
        }

        if (isActionSuccess(action)) {
          expectType<ActionSuccess<number>>(action);
        }
      }
    });

    it('passes the parameter through', async () => {
      const later = createAction.async('later', async (t: string) => t);
      const iterator = later('hello');
      await iterator.next();

      await expect(iterator.next()).resolves.toMatchObject({
        value: { payload: 'hello' },
      });
    });

    it('reports errors by dispatching them and re-throwing', async () => {
      const error = new Error('Testing async errors');
      const later = createAction.async('later', async () => {
        throw error;
      });

      const iterator = later();

      const { value: optimistic } = await iterator.next();
      expect(isOptimisticAction(optimistic)).toBe(true);

      const { value: failure } = await iterator.next();
      expect(isActionFailure(failure)).toBe(true);

      await expect(iterator.next()).rejects.toThrow(error);
    });
  });
});
