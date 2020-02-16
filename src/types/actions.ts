import Phase from '../constants/phase';

export type ActionConstant = string | symbol;
export type Action<Payload> =
  | ActionSuccess<Payload>
  | ActionFailure<Payload>
  | OptimisticAction<Payload>
  | VoidAction;

export interface ActionTypeCoercible {
  [Symbol.toPrimitive](hint: string): ActionConstant;
  toString(): ActionConstant;
}

export interface CoercibleAction<Args extends Array<any>, RetVal>
  extends ActionTypeCoercible {
  (...args: Args): RetVal;
}

export interface VoidAction {
  readonly type: ActionConstant;
  readonly error?: void;
  readonly meta?: void;
  readonly payload?: void;
}

export interface ActionSuccess<Payload> {
  readonly type: ActionConstant;
  readonly error?: false;
  readonly payload: Payload;
  readonly meta?: void;
}

export interface ActionFailure<Payload> {
  readonly type: ActionConstant;
  readonly error: true;
  readonly payload: Payload;
  readonly meta?: void;
}

export interface OptimisticAction<Payload> {
  readonly type: ActionConstant;
  readonly error?: false;
  readonly payload: Payload;
  readonly meta: {
    phase: Phase.Optimistic;
  };
}
