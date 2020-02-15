import { ActionConstant } from '../types/actions';
import Phase from '../phase-constants';
import bindActionType from './bind-action-type';

export default function createAsyncAction<
  TReturn,
  Effect extends (...args: any) => Promise<TReturn>
>(actionType: ActionConstant, effect: Effect) {
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

  return bindActionType(actionType, createAsyncAction);
}
