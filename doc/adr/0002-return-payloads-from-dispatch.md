# Return Payloads from Dispatch
- Status: proposed
- Deciders: @PsychoLlama

## Context and Problem Statement
Error suppression as described by
[ADR-0001](./0001-identify-known-errors-through-class-mixins.md) is
problematic. It complicates error handling by splitting errors into two modes,
thrown and returned, where callers still have to manually handle both cases.

This causes Redux to bleed through the action abstraction and imposes
overpriced cognitive overhead. To understand the return value, you must
understand error swallowing and all the tradeoffs that go with it, and even at
the end of it all, developers still have to manually handle errors.

## Decision Outcome
Remove known error handling and the `swallow(...)` mixin. It is not possible to
reasonably implement automatic error suppression.

## Positive Consequences
Actions can become more ergonomic by returning the payload directly, especially
when combined with `bindActionCreators(...)` (which is the common case).

Additionally, developers no longer need to test `result.error` before
consulting the payload. Errors are always thrown normally.

## Negative Consequences
For the case where dispatch return values were ignored, synchronous error
swallowing might have worked perfectly. Now developers are forced to manually
handle those errors (assuming it matters whether execution continues).
