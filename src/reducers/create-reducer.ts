import { Action } from '../types/actions';
import { CreateReducer } from '../types/create-reducer';
import handleAction from './handle-action';
import mapActionsToReducers from './map-actions-to-reducers';
import callOnce from '../utils/call-once';
import assert from '../utils/assert';
import { isActionFailure } from '../utils/action-variant';

function createReducer<State>(initialState: State, reducerFactory: Function) {
  assert(
    typeof reducerFactory === 'function',
    'createReducer(...) expects a function.',
  );

  // Wait until the first time the reducer is called before constructing the
  // reducer map. It's a semi-common pattern to share constants between
  // actions and reducers, which means the two files may form a circular
  // dependency. By the time `createReducer(...)` is called, those actions
  // could be undefined.
  const lazilyCreateActionMap = callOnce(() => {
    const reducers = reducerFactory(handleAction);
    const actionMap = mapActionsToReducers(reducers);

    return actionMap;
  });

  const reducer = <Payload>(
    state: State = initialState,
    action: Action<Payload>,
  ) => {
    const actionMap = lazilyCreateActionMap();
    const handlers = actionMap.get(action.type);
    if (!handlers) return state;

    const reducersForActionType = isActionFailure(action)
      ? handlers.error
      : handlers.success;

    return reducersForActionType.reduce(
      (state, reducer) => reducer(state, action.payload),
      state,
    );
  };

  return reducer;
}

export default createReducer as CreateReducer;
