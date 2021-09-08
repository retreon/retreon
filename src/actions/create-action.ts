import createAsyncAction from './create-async-action';
import bindActionType from './bind-action-type';
import validateActionType from './validate-action-type';
import {
  ActionConstant,
  CoercibleAction,
  ActionSuccess,
  ActionFailure,
  VoidAction,
} from '../types/actions';
import createActionFactory from './action-factory';

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
function createAction(
  type: ActionConstant,
): CoercibleAction<[], Generator<VoidAction, void>>;

// No effect. Just pass a payload.
function createAction<Payload>(
  type: ActionConstant,
): CoercibleAction<[Payload], Generator<ActionSuccess<Payload>, Payload>>;

// No arguments.
function createAction<Effect extends () => any>(
  type: ActionConstant,
  effect: Effect,
): CoercibleAction<[], ActionOutcomesForEffect<Effect>>;

// At least one argument.
function createAction<Effect extends (arg: any, ...args: any) => any>(
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
function createAction(actionType: any, effect?: any) {
  validateActionType(actionType);

  function executeEffectAndReturnAction(input: any) {
    // This action is free of side effects.
    if (effect === undefined) {
      if (input === undefined) {
        return { type: actionType };
      }

      // The caller explicitly provided a payload.
      return { type: actionType, payload: input };
    }

    // If given an effect, whatever it returns becomes the payload.
    return { type: actionType, payload: effect(input) };
  }

  return bindActionType(actionType, function* (input: any) {
    try {
      const action = executeEffectAndReturnAction(input);
      yield action;
      return action.payload;
    } catch (error) {
      const action = { type: actionType, error: true, payload: error };
      yield action;
      throw error;
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

// Advanced usage: action factory for generator functions.
createAction.factory = createActionFactory;

// If an effect is provided, we have to assume it can fail.
type ActionOutcomesForEffect<Effect extends (...args: any[]) => any> =
  Generator<
    ActionSuccess<ReturnType<Effect>> | ActionFailure<unknown>,
    ReturnType<Effect>
  >;

export default createAction;
