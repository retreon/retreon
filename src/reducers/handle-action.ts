import { ActionTypeCoercible } from '../types/actions';
import { ReducerDefinition } from './create-reducer';
import assert from '../utils/assert';
import getActionType from './get-action-type';
import ReducerType from '../constants/reducer-type';

const assertValidArguments = (
  actionCreator: ActionTypeCoercible,
  reducer: (...args: any) => any,
) => {
  assert(
    actionCreator !== undefined,
    'handleAction(...) expects an action creator (given undefined).',
  );

  assert(
    typeof reducer === 'function',
    'handleAction(...) expects a reducer function.',
  );
};

const handleAction = <
  ActionCreator extends ActionTypeCoercible,
  Reducer extends (...args: any) => any,
>(
  actionCreator: ActionCreator,
  reducer: Reducer,
): ReducerDefinition => {
  assertValidArguments(actionCreator, reducer);

  return {
    actionType: getActionType(actionCreator),
    reducerType: ReducerType.Success,
    reducer,
  };
};

handleAction.error = <
  ActionCreator extends ActionTypeCoercible,
  Reducer extends (...args: any) => any,
>(
  actionCreator: ActionCreator,
  reducer: Reducer,
): ReducerDefinition => {
  assertValidArguments(actionCreator, reducer);

  return {
    actionType: getActionType(actionCreator),
    reducerType: ReducerType.Error,
    reducer,
  };
};

handleAction.optimistic = <
  ActionCreator extends ActionTypeCoercible,
  Reducer extends (...args: any) => any,
>(
  actionCreator: ActionCreator,
  reducer: Reducer,
): ReducerDefinition => {
  assertValidArguments(actionCreator, reducer);

  return {
    actionType: getActionType(actionCreator),
    reducerType: ReducerType.Optimistic,
    reducer,
  };
};

export default handleAction;
