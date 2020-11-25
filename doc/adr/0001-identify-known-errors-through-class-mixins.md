# Identify Known Errors through Class Mixins
- Status: superseded by [ADR-0002](./0002-return-payloads-from-dispatch.md)
- Deciders: @PsychoLlama

## Context and Problem Statement
Retreon aims to provide robust error handling for all action creators, but
there is a key distinction between error types: known and unknown. Known
errors are anticipated failures, the type we explicitly handle, and unknown
errors are everything else.

Retreon should fail loudly when an action throws an unknown error. Type errors
and usage mistakes should be readily obvious to the developer. On the other
hand, known failures are already managed and logged by Redux, so additional
reporting serves only as a false positive.

Here is the problem: how do we differentiate between known and unknown errors?

## Decision Drivers
- The mechanism should avoid coupling action effects with retreon. Effects can
  grow into separate files and standalone utilities. Binding them to redux
  reduces their value.
- The mechanism should encourage developers to use real errors and good
  conventions.

## Considered Options
1. Allow a special return value with an associated payload that indicates an
   error. This is currently implemented for synchronous action creators (the
   `failure(...)` type).

   ```typescript
   return failure(new Error('known'))
   ```
2. Expose custom base classes for common error types meant for extension. If
   the thrown error is one of the base classes, consider it "known".

   ```typescript
   class CustomError extends RetreonTypeError {}
   throw new CustomError('known')
   ```
3. Export a decorator function to mark known error classes. It would return
   a wrapper class with a special hidden flag attached. Detect known errors by
   checking for the flag.

   ```typescript
   @expected
   class CustomError extends Error {}
   throw new CustomError('known')
   ```
4. Define a class mixin which uses the same flag approach as option #3.

   ```typescript
   class CustomError extends mixin(Error) {}
   throw new CustomError('known')
   ```

## Decision Outcome
I chose option #4 because it claimed the most positives (outlined below).
Synchronous and asynchronous actions will report errors the same way: by
throwing instances that derive from a retreon error mixin.

## Positive Consequences
- Integration with static analysis tooling. We're just using `throw`.
- Encouragement to use custom error classes. Although unusual in JavaScript,
  it has several benefits with automated error reporting services.
- Loose coupling of effects and retreon. Custom errors are equally as useful
  in competing frameworks and the mixin is easily removable with `sed`.

## Negative Consequences
- The error type can't be automatically inferred. TypeScript has no method to
  express `throw` types, so it must be `unknown`. Developers will need
  `instanceof` guards in their error reducers.

## Pros and Cons of the Options
### Option 1
- Good, because error types are communicated through the return signature.
- Bad, because unknown errors can't be assigned a type, causing a bit of
  a quandary when you implement the error reducer. You must choose to ignore
  unknown errors (unacceptable) or lie about the type signature for
  convenience (also unacceptable).
- Bad, because it encourages non-error objects as failure payloads. Tooling
  does not exist to enforce the rejected type, nor do developers have an
  intrinsically bad feeling about failing with primitive payloads, as you
  would with `throw`.

### Option 2
- Good, because it forces real error instances.
- Bad, because of obvious reasons. It forces you to define every base error up
  front, which isn't always possible, such as `MediaStreamError` or with 3rd
  party errors.

### Option 3
- Good, because it encourages real error instances (although it doesn't force
  them).
- Good, because it allows integration with all error types.
- Bad, because the decorator forces it into the top level of the class
  hierarchy. This precludes more aggressive features such as default name
  assignment because it risks overriding the developer's behaviors.
- Bad, because as of this writing, decorators are poorly supported and
  compiler dependent. TypeScript and Babel strongly disagree on implementation
  details. This concern bleeds out to the developer.

### Option 4
- Good, because it encourages real error instances (although much like #3 it
  doesn't force them).
- Good, because it allows integration with all error types.
- Good, because mixins allow injection of the class at any point in the
  hierarchy, allowing more aggressive features with less fear of overriding
  subclasses.
