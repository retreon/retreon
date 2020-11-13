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

    try {
      const payload = await effect(input);

      yield {
        type: actionType,
        payload,
      };

      return payload;
    } catch (error) {
      yield {
        type: actionType,
        error: true,
        payload: error,
      };

      // TODO: Determine how to treat known errors.
      throw error;
    }
  }

  return bindActionType(actionType, createAsyncAction);
}
