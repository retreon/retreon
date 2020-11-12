import {
  ActionConstant,
  CoercibleAction,
  ActionSuccess,
  ActionFailure,
  VoidAction,
} from './actions';
import { CreateAsyncAction } from './create-async-action';

type AnyFunction = (...args: any) => any;

export interface CreateAction extends CreateAsyncAction {
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
  (type: ActionConstant): CoercibleAction<[], ActionIterator<VoidAction>>;

  // No effect. Just pass a payload.
  <Payload>(type: ActionConstant): CoercibleAction<
    [Payload],
    ActionIterator<ActionSuccess<Payload>>
  >;

  // No arguments.
  <Effect extends () => any>(
    type: ActionConstant,
    effect: Effect,
  ): CoercibleAction<[], ActionOutcomesForEffect<Effect>>;

  // At least one argument.
  <Effect extends (arg: any, ...args: any) => any>(
    type: ActionConstant,
    effect: Effect,
  ): Effect extends (arg: infer T, ...args: any) => any
    ? CoercibleAction<[T], ActionOutcomesForEffect<Effect>>
    : never;
}

type ActionIterator<Action> = Generator<Action, Action>;

// If an effect is provided, we have to assume it can fail.
type ActionOutcomesForEffect<Effect extends AnyFunction> = ActionIterator<
  ActionSuccess<ReturnType<Effect>> | ActionFailure<unknown>
>;
