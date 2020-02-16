import { nothing, Draft } from 'immer';

import {
  Action,
  ActionConstant,
  ActionSuccess,
  ActionFailure,
  OptimisticAction,
} from './actions';

export interface CreateReducer {
  /**
   * Creates a standard redux reducer.
   * @param initialState An initial state.
   * @param reducerFactory A function which returns a list of action handlers.
   * @example
   * createReducer({ count: 0 }, handleAction => [
   *   handleAction(increment, (state) => {}),
   * ])
   */
  <State>(
    initialState: State,
    reducerFactory: ReducerDefinitionFactory<State>,
  ): (state: void | State, action: Action<any>) => State;
}

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
    ActionCreator extends (...args: any) => any,
    Reducer extends (
      state: Draft<State>,
      action: SuccessPayload<ActionCreator>,
    ) => NextState<State>
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
    ActionCreator extends (...args: any) => any,
    Reducer extends (
      state: Draft<State>,
      action: FailurePayload<ActionCreator>,
    ) => NextState<State>
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
    ActionCreator extends (...args: any) => AsyncGenerator,
    Reducer extends (
      state: Draft<State>,
      action: OptimisticPayload<ActionCreator>,
    ) => NextState<State>
  >(
    actionCreator: ActionCreator,
    reducer: Reducer,
  ): ReducerDefinition;
}

type NextState<State> = void | State | typeof nothing;

export interface ReducerDefinition {
  readonly reducerType: 'synchronous' | 'error';
  readonly actionType: ActionConstant;
  readonly reducer: (...args: any) => any;
}

type ReduxAction<ActionCreator> = ActionCreator extends (
  ...args: any
) => infer Payload
  ? Payload
  : never;

type SuccessPayload<ActionCreator extends (...args: any) => {}> = ReduxAction<
  ActionCreator
> extends ActionFailure<any> | ActionSuccess<infer Payload>
  ? Payload
  : ReduxAction<ActionCreator> extends ActionSuccess<infer Payload>
  ? Payload
  : never;

type FailurePayload<ActionCreator extends (...args: any) => {}> = ReduxAction<
  ActionCreator
> extends ActionSuccess<any> | ActionFailure<infer Failure>
  ? Failure
  : ReduxAction<ActionCreator> extends ActionFailure<infer Failure>
  ? Failure
  : never;

type OptimisticPayload<
  ActionCreator extends (...args: any) => AsyncGenerator<any>
> = ActionCreator extends (...args: any) => AsyncGenerator<infer Action>
  ? Action extends OptimisticAction<infer Payload> | ActionSuccess<any>
    ? Payload
    : never
  : never;
