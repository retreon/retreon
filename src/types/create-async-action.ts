import {
  ActionConstant,
  CoercibleAction,
  OptimisticAction,
  ActionSuccess,
} from './actions';

export interface CreateAsyncAction {
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
  async<Effect extends AsyncFunction>(
    type: ActionConstant,
    effect: Effect,
  ): Effect extends () => Promise<infer TReturn>
    ? CoercibleAction<[], ActionSequence<void, TReturn>>
    : never;

  async<Effect extends AnyAsyncFunction>(
    type: ActionConstant,
    effect: Effect,
  ): Effect extends (input: infer Input, ...args: any) => Promise<infer TReturn>
    ? CoercibleAction<[Input], ActionSequence<Input, TReturn>>
    : never;
}

type AsyncFunction = () => Promise<any>;
type AnyAsyncFunction = (...args: any) => Promise<any>;

type ActionSequence<Optimistic, TReturn> = AsyncGenerator<
  OptimisticAction<Optimistic> | ActionSuccess<TReturn>,
  TReturn,
  void
>;
