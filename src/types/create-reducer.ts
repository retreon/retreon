/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action, ActionConstant } from './actions';

type ActionCreatorPayload<ActionCreator> = ActionCreator extends (
  ...args: any
) => infer Payload
  ? Payload
  : never;

interface HandleAction<State> {
  <
    ActionCreator extends Function,
    Reducer extends (
      state: State,
      action: ActionCreatorPayload<ActionCreator>,
    ) => void
  >(
    actionCreator: ActionCreator,
    reducer: Reducer,
  ): ReducerDefinition;
}

export interface ReducerDefinition {
  reducerType: 'synchronous';
  actionType: ActionConstant;
  reducer: Function;
}

interface ReducerFactory<State> {
  (handleAction: HandleAction<State>): Array<ReducerDefinition>;
}

export interface CreateReducer {
  <State>(initialState: State, reducerFactory: ReducerFactory<State>): (
    state: void | State,
    action: Action<any>,
  ) => State;
}
