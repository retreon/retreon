/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action, ActionConstant } from './actions';
import { ActionSuccess, ActionFailure } from './create-action';

interface ReducerFactory<State> {
  (handleAction: HandleAction<State>): Array<ReducerDefinition>;
}

export interface CreateReducer {
  <State>(initialState: State, reducerFactory: ReducerFactory<State>): (
    state: void | State,
    action: Action<any>,
  ) => State;
}

interface HandleAction<State> {
  // handleAction(...)
  <
    ActionCreator extends (...args: any) => any,
    Reducer extends (
      state: State,
      action: SuccessPayload<ActionCreator>,
    ) => void
  >(
    actionCreator: ActionCreator,
    reducer: Reducer,
  ): ReducerDefinition;

  // handleAction.error(...)
  error<
    ActionCreator extends (...args: any) => any,
    Reducer extends (
      state: State,
      action: FailurePayload<ActionCreator>,
    ) => void
  >(
    actionCreator: ActionCreator,
    reducer: Reducer,
  ): ReducerDefinition;
}

export interface ReducerDefinition {
  reducerType: 'synchronous' | 'error';
  actionType: ActionConstant;
  reducer: Function;
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
