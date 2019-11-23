import { CoercibleAction, ActionConstant, Action } from './types/actions';
import { CreateReducer, ReducerDefinition } from './types/create-reducer';
import getActionType from './get-action-type';

type ActionHandlerMap = Map<ActionConstant, { synchronous: Array<Function> }>;

const buildActionMap = (
  definitions: Array<ReducerDefinition>,
): ActionHandlerMap => {
  const actionMap = new Map();

  definitions.forEach(({ actionType, reducer }) => {
    if (!actionMap.has(actionType)) {
      actionMap.set(actionType, {
        synchronous: [],
      });
    }

    const entries = actionMap.get(actionType);
    entries.synchronous.push(reducer);
  });

  return actionMap;
};

function createReducer<State>(initialState: State, reducerFactory: Function) {
  const handleAction = (
    actionCreator: CoercibleAction,
    reducer: (handleAction: Function) => Array<ReducerDefinition>,
  ) => ({
    actionType: getActionType(actionCreator),
    reducerType: 'synchronous',
    reducer,
  });

  const reducers = reducerFactory(handleAction);
  const actionMap = buildActionMap(reducers);

  const reducer = <Payload>(
    state: State = initialState,
    action: Action<Payload>,
  ) => {
    const handlers = actionMap.get(action.type);
    if (!handlers) return state;

    return handlers.synchronous.reduce(
      (state, reducer) => reducer(state, action),
      state,
    );
  };

  return reducer;
}

export default createReducer as CreateReducer;
