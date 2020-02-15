// `createAction(...)` coerces to its action constant. This utility function
// grabs that constant.
import { ActionConstant, ActionTypeCoercible } from '../types/actions';
import assert from '../utils/assert';

export default function getActionType(
  actionCreator: symbol | string | ActionTypeCoercible,
): ActionConstant {
  if (typeof actionCreator === 'symbol') return actionCreator;
  if (typeof actionCreator === 'string') return actionCreator;

  assert(
    typeof actionCreator === 'function',
    'Expected an action creator or action type.',
  );

  if (Symbol.toPrimitive in actionCreator) {
    return actionCreator[Symbol.toPrimitive]('default');
  }

  return String(actionCreator);
}
