import createAsyncAction from './create-async-action';
import bindActionType from './bind-action-type';
import validateActionType from './validate-action-type';
import { isKnownError } from '../utils/errors';
import {
  ActionConstant,
  CoercibleAction,
  ActionSuccess,
  ActionFailure,
  VoidAction,
} from '../types/actions';

/**
 * Returns a function which generates actions of the given type.
 * @param type A unique name which describes the action.
 * @param effect Something to run when the action is invoked. Whatever it
 * returns becomes the action payload.
 * @example
 * createAction('settings/load-theme', () => {
 *   return localStorage.getItem('theme')
 * })
 */
export default function createAction(
  type: ActionConstant,
): CoercibleAction<[], ActionIterator<VoidAction>>;

// No effect. Just pass a payload.
export default function createAction<Payload>(
  type: ActionConstant,
): CoercibleAction<[Payload], ActionIterator<ActionSuccess<Payload>>>;

// No arguments.
export default function createAction<Effect extends () => any>(
  type: ActionConstant,
  effect: Effect,
): CoercibleAction<[], ActionOutcomesForEffect<Effect>>;

// At least one argument.
export default function createAction<
  Effect extends (arg: any, ...args: any) => any
>(
  type: ActionConstant,
  effect: Effect,
): Effect extends (arg: infer T, ...args: any) => any
  ? CoercibleAction<[T], ActionOutcomesForEffect<Effect>>
  : never;

// Synchronous action creator.
//
// Example:
// createAction('add-file', file => {
//   return { url: URL.createObjectURL(file) }
// })
export default function createAction(actionType: any, effect?: any) {
  validateActionType(actionType);

  function executeEffectAndReturnAction(input: any) {
    if (effect === undefined) {
      if (input === undefined) {
        return { type: actionType };
      }

      return { type: actionType, payload: input };
    }

    return { type: actionType, payload: effect(input) };
  }

  return bindActionType(actionType, function* (input: any) {
    try {
      const action = executeEffectAndReturnAction(input);
      yield action;
      return action;
    } catch (error) {
      const action = { type: actionType, error: true, payload: error };
      yield action;

      // Known errors are swallowed to avoid false positives in the console
      // and error reporting services. This behavior is opt-in only.
      if (isKnownError(error)) {
        return action;
      } else {
        throw error;
      }
    }
  });
}

// Asynchronous action creator.
//
// Example:
// createAction.async('update-profile-photo', async photo => {
//   await http.put('/users/self/profile-photo/', photo)
// })
createAction.async = createAsyncAction;

type ActionIterator<Action> = Generator<Action, Action>;

// If an effect is provided, we have to assume it can fail.
type ActionOutcomesForEffect<
  Effect extends (...args: any[]) => any
> = ActionIterator<ActionSuccess<ReturnType<Effect>> | ActionFailure<unknown>>;
