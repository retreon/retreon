import { ActionConstant } from '../types/actions';
import Phase from '../constants/phase';
import bindActionType from './bind-action-type';
import validateActionType from './validate-action-type';

export default function createAsyncAction<
  TReturn,
  Effect extends (...args: any) => Promise<TReturn>
>(actionType: ActionConstant, effect: Effect) {
  validateActionType(actionType);

  async function* createAsyncAction(
    input: Parameters<Effect>[0],
  ): AsyncGenerator<any, TReturn> {
    yield {
      type: actionType,
      meta: { phase: Phase.Optimistic },
    };

    const payload = await effect(input);

    yield {
      type: actionType,
      payload,
    };

    return payload;
  }

  return bindActionType(actionType, createAsyncAction);
}
