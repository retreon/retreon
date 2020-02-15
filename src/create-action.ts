import { InputType, ActionConstant } from './types/actions';
import { CreateAction } from './types/create-action';
import { isFailure, getValue } from './action-failure';
import Phase from './phase-constants';

const allowActionTypeCoercion = <Fn extends Function>(
  actionType: ActionConstant,
  fn: Fn,
) =>
  Object.assign(fn, {
    [Symbol.toPrimitive]: () => actionType,
    toString: () => actionType,
  });

const createAction = <Effect extends (...args: any) => any>(
  actionType: ActionConstant,
  effect?: Effect,
) =>
  allowActionTypeCoercion(actionType, (input: InputType<Effect>) => {
    if (effect === undefined) {
      if (input === undefined) {
        return { type: actionType };
      }

      return { type: actionType, payload: input };
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
  });

createAction.async = <
  TReturn,
  Effect extends (...args: any) => Promise<TReturn>
>(
  actionType: ActionConstant,
  effect: Effect,
) => {
  async function* createAsyncAction(): AsyncGenerator<any, TReturn> {
    yield {
      type: actionType,
      meta: { phase: Phase.Optimistic },
    };

    const payload = await effect();

    yield {
      type: actionType,
      payload,
    };

    return payload;
  }

  return allowActionTypeCoercion(actionType, createAsyncAction);
};

export default (createAction as unknown) as CreateAction;
