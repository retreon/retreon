/**
 * `Phase` represents different phases of the same action. The specific use
 * case is optimistic updates: we need a way to distinguish an optimistic
 * action from a finished action of the same type.
 *
 * Technically for completeness there should be "Fulfilled" and "Rejected"
 * phases, but it's implicit with the lack of `Optimistic` and `error: true`.
 * There's value in keeping action objects as minimal as possible.
 *
 * If you're feeling bored, there's an interesting discussion about approaches
 * to optimistic actions on the FSA repo:
 * https://github.com/redux-utilities/flux-standard-action/issues/7
 * @private
 */
enum Phase {
  Optimistic = 'optimistic',
}

export default Phase;
