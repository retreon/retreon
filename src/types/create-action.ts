/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionConstant, CoercibleAction } from './actions';
import { Exception, VALUE } from '../action-failure';

type Fn = (...args: any) => any;

export interface CreateAction {
  <Effect extends Fn>(type: ActionConstant, effect?: Effect): ActionCreator<
    Effect
  >;
}

type ActionCreator<Effect extends void | Fn> = Effect extends void
  ? CoercibleAction<() => ActionSuccess<void>>
  : Effect extends () => any
  ? CoercibleAction<() => ActionResult<Effect>>
  : Effect extends (input: infer Input, ...args: any) => any
  ? CoercibleAction<(input: Input) => ActionResult<Effect>>
  : never;

type ActionResult<Effect extends Fn> = Effect extends (
  ...args: any
) => Exception<infer Failure>
  ? ActionFailure<Failure>
  : Effect extends (...args: any) => Exception<infer Failure> | infer Payload
  ? ActionFailure<Failure> | ActionSuccess<Payload>
  : Effect extends (...args: any) => infer Payload
  ? ActionSuccess<Payload>
  : never;

export type ActionSuccess<Payload> = {
  type: ActionConstant;
  error?: false;
  payload: Payload;
};

export type ActionFailure<Payload> = {
  type: ActionConstant;
  error: true;
  payload: Payload;
};

type FailureType<Effect extends Fn> = ReturnType<Effect>[typeof VALUE];
