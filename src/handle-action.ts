import { ActionTypeCoercible } from './types/actions';
import { ReducerDefinition } from './types/create-reducer';
import assert from './assert';
import getActionType from './get-action-type';

const assertValidArguments = (
  actionCreator: ActionTypeCoercible,
  reducer: Function,
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
  Reducer extends (...args: any) => any
>(
  actionCreator: ActionCreator,
  reducer: Reducer,
): ReducerDefinition => {
  assertValidArguments(actionCreator, reducer);

  return {
    actionType: getActionType(actionCreator),
    reducerType: 'synchronous',
    reducer,
  };
};

handleAction.error = <
  ActionCreator extends ActionTypeCoercible,
  Reducer extends (...args: any) => any
>(
  actionCreator: ActionCreator,
  reducer: Reducer,
): ReducerDefinition => {
  assertValidArguments(actionCreator, reducer);

  return {
    actionType: getActionType(actionCreator),
    reducerType: 'error',
    reducer,
  };
};

export default handleAction;
