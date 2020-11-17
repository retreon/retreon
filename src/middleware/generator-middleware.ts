/* eslint-disable no-constant-condition */
import { Middleware } from 'redux';

/**
 * A redux middleware which adds support for async actions and action
 * sequences.
 */
const reduxMiddleware: Middleware = ({ dispatch }) => (next) => <
  PossiblyAnything extends DispatchCompatible<typeof dispatch>,
  YieldedAction extends DispatchCompatible<typeof dispatch>
>(
  action:
    | AsyncIterator<YieldedAction>
    | Iterator<YieldedAction>
    | PossiblyAnything,
) => {
  if (isIterator(action)) {
    if (supportsAsyncIteration(action)) {
      return consumeAsyncIterator(dispatch, action);
    }

    // Yes, this is phrased oddly. TypeScript insisted.
    if (!supportsAsyncIteration(action)) {
      return consumeSyncIterator(dispatch, action);
    }
  }

  return next(action);
};

// This produces the set of all things which can be dispatched.
type DispatchCompatible<Dispatch extends (...args: any) => any> = Parameters<
  Dispatch
>[0];

// Consume the async iterator. Every yielded value is dispatched and the
// return value is resolved and returned from `dispatch(...)`.
const consumeAsyncIterator = async <
  Dispatch extends (...args: any) => any,
  Action extends DispatchCompatible<Dispatch>,
  ReturnType
>(
  dispatch: Dispatch,
  iterator: AsyncIterator<Action, ReturnType, unknown>,
): Promise<ReturnType> => {
  let prevDispatchResult: unknown;

  while (true) {
    const result: IteratorResult<Action, ReturnType> = await iterator.next(
      prevDispatchResult,
    );

    // The iterator finished. Resolve with the return value.
    if (result.done) return result.value;

    // The iterator yielded a value. Dispatch it.
    prevDispatchResult = await dispatch(result.value);
  }
};

const consumeSyncIterator = <
  Dispatch extends (...args: any) => any,
  Action extends DispatchCompatible<Dispatch>,
  ReturnType
>(
  dispatch: Dispatch,
  iterator: Iterator<Action, ReturnType, unknown>,
) => {
  let prevDispatchResult: unknown;

  while (true) {
    const result: IteratorResult<Action, ReturnType> = iterator.next(
      prevDispatchResult,
    );

    if (result.done) return result.value;

    prevDispatchResult = dispatch(result.value);
  }
};

const supportsAsyncIteration = <T>(
  iterator: AsyncIterator<T> | Iterator<T>,
): iterator is AsyncIterator<T> => {
  return Symbol.asyncIterator in iterator;
};

const isIterator = <T>(value: any): value is AsyncIterator<T> | Iterator<T> => {
  return (
    value &&
    typeof value.next === 'function' &&
    typeof value.throw === 'function' &&
    typeof value.return === 'function'
  );
};

// Pull the return type out of an async iterator.
type IteratorReturnType<
  Sequence extends Iterator<any, any, any> | AsyncIterator<any, any, any>
> = Sequence extends Iterator<any, infer TReturn, any>
  ? TReturn
  : Sequence extends AsyncIterator<any, infer TReturn, any>
  ? TReturn
  : never;

// Overload `store.dispatch(...)` to add support for iterators.
declare module 'redux' {
  interface Dispatch {
    // Synchronous action creators
    <Sequence extends Iterator<any>>(action: Sequence): IteratorReturnType<
      Sequence
    >;

    // Async action creators
    <Sequence extends AsyncIterator<any>>(action: Sequence): Promise<
      IteratorReturnType<Sequence>
    >;
  }
}

export default reduxMiddleware;
