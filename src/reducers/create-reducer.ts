import { Draft, nothing } from 'immer';

import handleAction from './handle-action';
import mapActionsToReducers from './map-actions-to-reducers';
import callOnce from '../utils/call-once';
import assert from '../utils/assert';
import { isActionFailure, isOptimisticAction } from '../utils/action-variant';
import { Action, ActionConstant } from '../types/actions';
import ReducerType from '../constants/reducer-type';
import { SuccessPayload, OptimisticPayload } from '../types/payload';
import { ActionFactory } from '../actions/action-factory';

export default function createReducer<
  State,
  ActionHandlerFactory extends ReducerDefinitionFactory<State>,
>(
  initialState: State,
  reducerFactory: ActionHandlerFactory,
): (state: undefined | State, action: Action<any>) => State {
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
    assert(
      typeof reducers !== 'undefined',
      `createReducer(...) expects a list of action handlers (got undefined).`,
    );

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
      : isOptimisticAction(action)
      ? handlers.optimistic
      : handlers.success;

    return reducersForActionType.reduce(
      (state, reducer) => reducer(state, action.payload),
      state,
    );
  };

  return reducer;
}

// `createReducer` has a circular type which makes the definition somewhat
// tedious. We can't define `handleAction` without knowing how you're calling
// `createReducer`, and we can't define how to call `createReducer` without
// knowing the type for `handleAction`. The state and reducer types are
// codependent.
//
// Lifting `handleAction` to a parametrized interface allows us to express the
// type for the reducer parameter and in turn, `createReducer`.
interface ReducerDefinitionFactory<State> {
  /**
   * Use this callback to define all your reducers.
   * @param handleAction Associates an action with a reducer.
   * @return A list of reducers defined using `handleAction(...)`.
   * @example
   * createReducer(0, handleAction => [
   *   handleAction(action, reducer),
   * ])
   */
  (handleAction: HandleAction<State>): Array<ReducerDefinition>;
}

export interface ReducerDefinition {
  readonly reducerType: ReducerType;
  readonly actionType: ActionConstant;
  readonly reducer: (...args: any) => any;
}

interface HandleAction<State> {
  /**
   * Associates a reducer with an action creator.
   * @param actionCreator An action creator defined with `createAction(...)`.
   * @param reducer A handler invoked whenever the action is dispatched. It's
   * okay to mutate state here.
   * @example
   * handleAction(increment, state => {
   *   state.count++
   * })
   */
  <
    ActionCreator extends ActionFactory<any, any> | ((...args: any) => any),
    Reducer extends (
      state: Draft<State>,
      action: SuccessPayload<ActionCreator>,
    ) => NextState<State>,
  >(
    actionCreator: ActionCreator,
    reducer: Reducer,
  ): ReducerDefinition;

  /**
   * Associates an action with an error handler.
   * @param actionCreator An action creator defined with `createAction(...)`.
   * @param reducer A handler invoked whenever the action is dispatched. It's
   * okay to mutate state here.
   * @example
   * handleAction.error(loadTheme, state => {
   *   state.theme = THEME_FALLBACK
   * })
   */
  error<
    ActionCreator extends ActionFactory<any, any> | ((...args: any) => any),
    Reducer extends (state: Draft<State>, error: unknown) => NextState<State>,
  >(
    actionCreator: ActionCreator,
    reducer: Reducer,
  ): ReducerDefinition;

  /**
   * Associates an async action with an optimistic handler.
   * @param actionCreator An action creator defined with `createAction.async(...)`.
   * @param reducer A handler invoked whenever the action is dispatched. It's
   * okay to mutate state here.
   * @example
   * handleAction.optimistic(search, state => {
   *   state.loading = true
   * })
   */
  optimistic<
    ActionCreator extends
      | ActionFactory<any, any>
      | ((...args: any) => AsyncGenerator<any, any>),
    Reducer extends (
      state: Draft<State>,
      action: OptimisticPayload<ActionCreator>,
    ) => NextState<State>,
  >(
    actionCreator: ActionCreator,
    reducer: Reducer,
  ): ReducerDefinition;
}

type NextState<State> = void | State | typeof nothing;
