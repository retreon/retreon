/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  InputType,
  PayloadType,
  Action,
  ActionConstant,
} from './types/actions';

// The `createAction(...)` utility only allows 1 argument. If the effect
// doesn't take an argument, neither should the action creator.
type HofType<Effect extends Function> = Effect extends () => infer Payload
  ? () => Action<Payload>
  : Effect extends (input: infer Input, ...rest: any) => infer Payload
  ? (input: Input) => Action<Payload>
  : never;

export default function createAction<Effect extends Function>(
  actionType: ActionConstant,
  effect: Effect,
) {
  const actionCreator = Object.assign(
    (input: InputType<Effect>) => {
      const payload: PayloadType<Effect> = effect(input);

      return { type: actionType, payload };
    },
    {
      [Symbol.toPrimitive]: () => actionType,
      toString: () => actionType,
    },
  );

  return actionCreator as HofType<Effect> & {
    [Symbol.toPrimitive](): ActionConstant;
    toString(): ActionConstant;
  };
}
