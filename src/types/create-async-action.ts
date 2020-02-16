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
  ): CoercibleAction<[], ActionGenerator<Effect>>;
}

type AsyncFunction = () => Promise<any>;
type AnyAsyncFunction = (...args: any) => Promise<any>;

type ActionGenerator<Effect extends AnyAsyncFunction> = ActionSequence<
  ResolveType<ReturnType<Effect>>
>;

type ActionSequence<TReturn> = AsyncGenerator<
  OptimisticAction<void> | ActionSuccess<TReturn>,
  TReturn,
  void
>;

type ResolveType<P extends Promise<any>> = P extends Promise<infer Resolve>
  ? Resolve
  : never;
