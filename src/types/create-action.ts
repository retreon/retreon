/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionConstant } from './actions';
import { Exception, VALUE } from '../action-failure';

type Fn = (...args: any) => any;

export interface CreateAction {
  <Effect extends Fn>(type: ActionConstant, effect?: Effect): ActionCreator<
    Effect
  >;
}

type ActionCreator<Effect extends Fn> = {
  [Symbol.toPrimitive](hint: string): ActionConstant;
  toString(): string;
} & Effect extends void
  ? () => ActionSuccess<void>
  : Effect extends () => any
  ? () => ActionResult<Effect>
  : Effect extends (input: infer Input, ...args: any) => any
  ? (input: Input) => ActionResult<Effect>
  : never;

type ActionResult<Effect extends Fn> = ReturnType<Effect> extends Exception<
  FailureType<Effect>
>
  ? ActionFailure<ReturnType<Effect>[typeof VALUE]>
  : ActionSuccess<ReturnType<Effect>>;

type ActionSuccess<Payload> = {
  type: ActionConstant;
  error?: false;
  payload: Payload;
};

type ActionFailure<Payload> = {
  type: ActionConstant;
  error: true;
  payload: Payload;
};

type FailureType<Effect extends Fn> = ReturnType<Effect>[typeof VALUE];
