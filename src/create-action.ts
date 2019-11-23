/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputType, PayloadType, ActionType } from './types/actions';

// The `createAction(...)` utility only allows 1 argument. If the effect
// doesn't take an argument, neither should the action creator.
type HofType<Type, Effect extends Function> = Effect extends () => infer Payload
  ? () => ActionType<Type, Payload>
  : Effect extends (input: infer Input, ...rest: any) => infer Payload
  ? (input: Input) => ActionType<Type, Payload>
  : never;

export default function createAction<
  ActionType extends string | symbol,
  Effect extends Function
>(actionType: ActionType, effect: Effect) {
  const actionCreator = Object.assign(
    (input: InputType<Effect>) => {
      const payload: PayloadType<Effect> = effect(input);

      return { type: actionType, payload };
    },
    {
      toString: () => actionType,
    },
  );

  return actionCreator as HofType<ActionType, Effect> & {
    toString(): ActionType;
  };
}
