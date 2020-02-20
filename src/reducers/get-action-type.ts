// `createAction(...)` coerces to its action constant. This utility function
// grabs that constant.
import { ActionConstant, ActionTypeCoercible } from '../types/actions';
import assert from '../utils/assert';

export default function getActionType(
  actionCreator: string | ActionTypeCoercible,
): ActionConstant {
  if (typeof actionCreator === 'string') return actionCreator;

  assert(
    typeof actionCreator === 'function',
    'Expected an action creator or action type.',
  );

  return String(actionCreator);
}
