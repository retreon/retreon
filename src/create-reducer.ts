import { CoercibleAction, ActionConstant, Action } from './types/actions';

type ReducerReturnType<State> = void | State;

interface ReducerDefinition<Reducer> {
  actionType: ActionConstant;
  reducerType: 'synchronous';
  reducer: Reducer;
}

interface HandleAction<State> {
  <
    ActionCreator extends CoercibleAction,
    Reducer extends (
      state: State,
      action: ReturnType<ActionCreator>,
    ) => ReducerReturnType<State>
  >(
    action: ActionCreator,
    reducer: Reducer,
  ): ReducerDefinition<Reducer>;
}

type ActionHandlerMap = Map<ActionConstant, { synchronous: Array<Function> }>;

const buildActionMap = (
  definitions: Array<ReducerDefinition<Function>>,
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

function createReducer<
  State,
  ReducerFactory extends (
    handleAction: HandleAction<State>,
  ) => Array<ReducerDefinition<Function>>
>(initialState: State, reducerFactory: ReducerFactory) {
  const handleAction: HandleAction<State> = <Reducer>(
    actionCreator: CoercibleAction,
    reducer: Reducer,
  ) => ({
    actionType: actionCreator[Symbol.toPrimitive]('default'),
    reducerType: 'synchronous',
    reducer,
  });

  const reducers = reducerFactory(handleAction);
  const actionMap = buildActionMap(reducers);

  const reducer = (state: State = initialState, action: Action<any>) => {
    const handlers = actionMap.get(action.type);
    if (!handlers) return state;

    return handlers.synchronous.reduce(
      (state, reducer) => reducer(state, action),
      state,
    );
  };

  return reducer;
}

export default createReducer;
