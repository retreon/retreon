import { ActionConstant, CoercibleAction } from './actions';
import { Exception } from '../action-failure';

type AnyFunction = (...args: any) => any;

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
  (type: ActionConstant): CoercibleAction<[], VoidAction>;

  // No arguments.
  <Effect extends () => any>(
    type: ActionConstant,
    effect: Effect,
  ): CoercibleAction<[], ActionForEffect<Effect>>;

  // At least one argument.
  <Effect extends (arg: any, ...args: any) => any>(
    type: ActionConstant,
    effect: Effect,
  ): Effect extends (arg: infer T, ...args: any) => any
    ? CoercibleAction<[T], ActionForEffect<Effect>>
    : never;
}

type NotException<Value> = Value extends Exception<any> ? never : Value;

// Turns the return value of an effect into an action object. This is the
// most difficult type signature of `createAction(...)`. Avoid changing it.
type ActionForEffect<Effect extends AnyFunction> = ReturnType<
  Effect
> extends Exception<infer Failure> // The action always fails.
  ? ActionFailure<Failure>
  : ReturnType<Effect> extends NotException<ReturnType<Effect>> // This action never fails.
  ? ActionSuccess<ReturnType<Effect>>
  : ReturnType<Effect> extends Exception<infer Failure> | infer Payload // This action *might* fail.
  ? ActionFailure<Failure> | ActionSuccess<Payload>
  : never; // This action is drunk.

// Void actions don't carry a payload and can never fail.
export type VoidAction = {
  readonly type: ActionConstant;
};

export type ActionSuccess<Payload> = {
  readonly type: ActionConstant;
  readonly error?: false; // Purely for type inference.
  readonly payload: Payload;
};

// Failed actions carry an arbitrary payload and always have
export type ActionFailure<Payload> = {
  readonly type: ActionConstant;
  readonly error: true;
  readonly payload: Payload;
};
