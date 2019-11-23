import { Action } from './types/actions';
import { CreateReducer } from './types/create-reducer';
import handleAction from './handle-action';
import mapActionsToReducers from './map-actions-to-reducers';

function createReducer<State>(initialState: State, reducerFactory: Function) {
  const reducers = reducerFactory(handleAction);
  const actionMap = mapActionsToReducers(reducers);

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
