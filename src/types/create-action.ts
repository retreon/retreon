import { ActionConstant, CoercibleAction } from './actions';
import { Exception } from '../action-failure';

type Fn = (...args: any) => any;

export interface CreateAction {
  /**
   * Returns a function which generates actions of the given type.
   * @param type A unique name which describes the action.
   * @param effect Something to run when the action is invoked. Whatever it
   * returns becomes the action payload. Return `failure(...)` to signal an error.
   * @example
   * createAction('settings/load-theme', () => {
   *   return localStorage.getItem('theme')
   * })
   */
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
  readonly type: ActionConstant;
  readonly error?: false;
  payload: Payload;
};

export type ActionFailure<Payload> = {
  readonly type: ActionConstant;
  readonly error: true;
  payload: Payload;
};
