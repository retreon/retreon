import Phase from '../phase-constants';

export type ActionConstant = string | symbol;
export type Action<Payload> =
  | ActionSuccess<Payload>
  | ActionFailure<Payload>
  | OptimisticAction<Payload>;

export interface ActionTypeCoercible {
  [Symbol.toPrimitive](hint: string): ActionConstant;
  toString(): ActionConstant;
}

export interface CoercibleAction<Args extends Array<any>, RetVal>
  extends ActionTypeCoercible {
  (...args: Args): RetVal;
}

// This only applies to action creators without effects and no payload types.
// It's an edge case to improve type inference. As far as the reducers are
// concerned, it doesn't exist. They only see `FluxStandardAction`.
export interface VoidAction {
  readonly type: ActionConstant;
}

// See: https://github.com/redux-utilities/flux-standard-action
interface FluxStandardAction {
  readonly type: ActionConstant;
  readonly error?: boolean;
  readonly payload: unknown;
}

export interface ActionSuccess<Payload> extends FluxStandardAction {
  readonly error?: false;
  readonly payload: Payload;
  readonly meta?: void;
}

export interface ActionFailure<Payload> extends FluxStandardAction {
  readonly error: true;
  readonly payload: Payload;
  readonly meta?: void;
}

export interface OptimisticAction<Payload> extends FluxStandardAction {
  readonly error?: false;
  readonly payload: Payload;
  readonly meta: {
    phase: Phase.Optimistic;
  };
}
