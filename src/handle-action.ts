import { CoercibleAction } from './types/actions';
import { ReducerDefinition } from './types/create-reducer';
import assert from './assert';
import getActionType from './get-action-type';

const handleAction = <
  ActionCreator extends CoercibleAction,
  Reducer extends Function
>(
  actionCreator: ActionCreator,
  reducer: Reducer,
): ReducerDefinition => {
  assert(
    actionCreator !== undefined,
    'handleAction(...) expects an action creator (given undefined).',
  );

  assert(
    typeof reducer === 'function',
    'handleAction(...) expects a reducer function.',
  );

  return {
    actionType: getActionType(actionCreator),
    reducerType: 'synchronous',
    reducer,
  };
};

export default handleAction;
