import { InputType, ActionConstant } from './types/actions';
import { CreateAction } from './types/create-action';
import { isFailure, getValue } from './action-failure';

const createAction = <Effect extends Function>(
  actionType: ActionConstant,
  effect?: Effect,
) => {
  const actionCreator = Object.assign(
    (input: InputType<Effect>) => {
      if (effect === undefined) {
        return { type: actionType };
      }

      const payload = effect(input);

      if (isFailure(payload)) {
        return {
          type: actionType,
          error: true,
          payload: getValue(payload),
        };
      }

      return { type: actionType, payload };
    },
    {
      [Symbol.toPrimitive]: () => actionType,
      toString: () => actionType,
    },
  );

  return actionCreator;
};

export default createAction as CreateAction;
