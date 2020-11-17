import Phase from '../constants/phase';
import bindActionType from './bind-action-type';
import validateActionType from './validate-action-type';
import {
  ActionConstant,
  CoercibleAction,
  ActionSuccess,
  ActionFailure,
  OptimisticAction,
} from '../types/actions';

/**
 * Wraps an async function in an action creator. It optimistically
 * dispatches immediately, then again when the promise resolves.
 * @param type A unique name which describes the action.
 * @param effect Any function that returns a promise.
 *
 * @example
 * createAction.async('account/save-settings', (settings: AccountSettings) => {
 *   await http.put(`/accounts/${accountId}/settings/`, settings)
 * })
 */
export default function createAsyncAction<Effect extends AsyncFunction>(
  type: ActionConstant,
  effect: Effect,
): Effect extends () => Promise<infer TReturn>
  ? CoercibleAction<[], AsyncActionSequence<void, TReturn>>
  : never;

export default function createAsyncAction<Effect extends AnyAsyncFunction>(
  type: ActionConstant,
  effect: Effect,
): Effect extends (input: infer Input, ...args: any) => Promise<infer TReturn>
  ? CoercibleAction<[Input], AsyncActionSequence<Input, TReturn>>
  : never;

export default function createAsyncAction<
  TReturn,
  Effect extends (...args: any) => Promise<TReturn>
>(actionType: ActionConstant, effect: Effect) {
  validateActionType(actionType);

  async function* createAsyncAction(
    input: Parameters<Effect>[0],
  ): AsyncGenerator<any, TReturn> {
    const optimistic = { phase: Phase.Optimistic };

    yield input === undefined
      ? { type: actionType, meta: optimistic }
      : { type: actionType, payload: input, meta: optimistic };

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

type AsyncFunction = () => Promise<any>;
type AnyAsyncFunction = (...args: any) => Promise<any>;

export type AsyncActionSequence<Optimistic, TReturn> = AsyncGenerator<
  | OptimisticAction<Optimistic>
  | ActionSuccess<TReturn>
  | ActionFailure<unknown>,
  TReturn,
  void
>;
