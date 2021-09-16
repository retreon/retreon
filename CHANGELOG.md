# Changelog
All notable changes to retreon will be documented in this file.

The format is based on [Keep
a Changelog](https://keepachangelog.com/en/1.0.0/) and the project adheres to
[semver](https://semver.org/).

## [UNRELEASED]

## [0.7.0] - 2021-09-16
Changed:
- Upgraded immer from `8.0.1` to `9.0.6` (see [release
  notes](https://github.com/immerjs/immer/releases)).

Fixed:
- Bug where `createAction.{async,factory}` functions weren't recognized by
  newer versions of TypeScript.

## [0.6.1] - 2021-01-24
Changed:
- Upgraded immer from `8.0.0` to `8.0.1` (see [release
  notes](https://github.com/immerjs/immer/releases/tag/v8.0.1)).

## [0.6.0] - 2020-11-25
Removed:
- The experimental `swallow(...)` class mixin was unsuccessful. It has been
  removed.

## [0.5.0] - 2020-11-24
Changed:
- Upgraded immer from `7.0.14` to `8.0.0` (see [release
  notes](https://github.com/immerjs/immer/releases/tag/v8.0.0)).

Added:
- Better examples for async actions.
- Links to new documentation website.

## [0.4.0] - 2020-11-18
Added:
- Support for older browsers (back through IE 11, currently untested).
- Dispatch return values in generator `yield` expressions.
- `createAction.factory(...)` for fine-grained control in generators.

Changed:
- Enabled several compiler optimizations for smaller bundles.

Fixed:
- `unknown` payload type regression on reducers handling synchronous action
  creators with effects.

## [0.3.0] - 2020-11-13
Added:
- Error handling for every error thrown in an action, not just `failure(...)`
  return values.
- Error dispatches for async action creators. Just use `throw`.
- Support for dispatching synchronous iterators. This is an advanced and
  rarely useful feature.
- `swallow(...)` class mixin marking known errors that are safe to ignore.
  This feature is experimental.

Removed:
- Payload type inference in `handleAction.error(...)` (`throw` types aren't
  statically analyzable).
- The `failure(...)` return type. Instead, throw an error.

Changed:
- All action creators return iterators now. This may break your tests.

Fixed:
- Added payload to optimistic actions. This was accidentally omitted in the
  original implementation.

## [0.2.0] - 2020-06-20
Changed:
- Upgraded immer from `^5.3.6` to `^7.0.3` (major changes listed below).
  - Support for `Map`/`Set` is no longer enabled by default.

Fixed:
- Parameters are passed to async action creators (#93).

## [0.1.0] - 2020-02-19
Initial release.

[UNRELEASED]: https://github.com/PsychoLlama/retreon/compare/v0.7.0...HEAD
[0.7.0]: https://github.com/PsychoLlama/retreon/compare/v0.6.1...v0.7.0
[0.6.1]: https://github.com/PsychoLlama/retreon/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/PsychoLlama/retreon/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/PsychoLlama/retreon/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/PsychoLlama/retreon/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/PsychoLlama/retreon/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/PsychoLlama/retreon/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/PsychoLlama/retreon/releases/tag/v0.1.0
