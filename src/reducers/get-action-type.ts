// `createAction(...)` coerces to its action constant. This utility function
// grabs that constant.
import { ActionConstant, ActionTypeCoercible } from '../types/actions';
import { ACTION_TYPE, ActionFactory } from '../actions/action-factory';
import assert from '../utils/assert';

export default function getActionType(
  actionCreator: string | ActionTypeCoercible | ActionFactory<any, any>,
): ActionConstant {
  if (typeof actionCreator === 'string') return actionCreator;

  if (ACTION_TYPE in Object(actionCreator)) {
    return (actionCreator as ActionFactory<any, any>)[ACTION_TYPE];
  }

  assert(
    typeof actionCreator === 'function',
    'Expected an action creator or action type.',
  );

  return String(actionCreator);
}
