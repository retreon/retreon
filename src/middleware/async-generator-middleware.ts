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
  action: PossiblyAnything | AsyncIterator<YieldedAction>,
) => {
  if (isIterator(action) && supportsAsyncIteration(action)) {
    return consumeAsyncIterator(dispatch, action);
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
  generator: AsyncIterator<Action, ReturnType>,
): Promise<ReturnType> => {
  while (true) {
    // TODO: Decide what, if anything, should go into `.next(...)`.
    const result: IteratorResult<Action, ReturnType> = await generator.next();

    // The iterator finished. Resolve with the return value.
    if (result.done) return result.value;

    // The iterator yielded a value. Dispatch it.
    await dispatch(result.value);
  }
};

const supportsAsyncIteration = <T>(
  generator: AsyncIterator<T> | Iterator<T>,
): generator is AsyncIterator<T> => {
  return Symbol.asyncIterator in generator;
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
  Iterator extends AsyncIterator<any, any, any>
> = Iterator extends AsyncIterator<any, infer TReturn, any> ? TReturn : never;

// Overload `store.dispatch(...)` to add support for async iterators.
declare module 'redux' {
  interface Dispatch<A extends Action> {
    <Iterator extends AsyncIterator<any>>(action: Iterator): Promise<
      IteratorReturnType<Iterator>
    >;
  }
}

export default reduxMiddleware;
