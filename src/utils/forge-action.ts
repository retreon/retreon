import {
  ActionSuccess,
  ActionFailure,
  OptimisticAction,
  ActionTypeCoercible,
} from '../types/actions';
import getActionType from '../reducers/get-action-type';
import Phase from '../constants/phase';

// Constructs action objects without invoking effects. Useful primarily in
// tests. Purely internal.
const forgeAction = <
  ActionCreator extends ActionTypeCoercible & ((...args: any) => any),
  T
>(
  actionCreator: ActionCreator,
  payload: T,
): ActionSuccess<T> => {
  const action = {
    type: getActionType(actionCreator),
    payload,
  };

  if (payload === undefined) {
    delete action.payload;
  }

  return action;
};

forgeAction.error = <
  ActionCreator extends ActionTypeCoercible & ((...args: any) => any),
  T
>(
  actionCreator: ActionCreator,
  payload: T,
): ActionFailure<T> => ({
  type: getActionType(actionCreator),
  error: true,
  payload,
});

forgeAction.optimistic = <
  ActionCreator extends ActionTypeCoercible & ((...args: any) => any),
  T
>(
  actionCreator: ActionCreator,
  payload: T,
): OptimisticAction<T> => ({
  type: getActionType(actionCreator),
  payload,
  meta: {
    phase: Phase.Optimistic,
  },
});

export default forgeAction;
