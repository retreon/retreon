# Changelog
All notable changes to retreon will be documented in this file.

The format is based on [Keep
a Changelog](https://keepachangelog.com/en/1.0.0/) and the project adheres to
[semver](https://semver.org/).

## [UNRELEASED]
Added:
- Error handling for every error thrown in an action, not just `failure(...)`
  return values.
- Error dispatches for async action creators. Just use `throw`.
- Support for dispatching synchronous iterators. This is an advanced and
  rarely useful feature.

Removed:
- Payload type inference in `handleAction.error(...)` (`throw` types aren't
  statically analyzable).
- The `failure(...)` return type. Instead, throw an error.

Changed:
- All action creators return iterators now. This may break your tests.

## [0.2.0] - 2020-06-20
Changed:
- Upgraded immer from `^5.3.6` to `^7.0.3` (major changes listed below).
  - Support for `Map`/`Set` is no longer enabled by default.

Fixed:
- Parameters are passed to async action creators (#93).

## [0.1.0] - 2020-02-19
Initial release.

[UNRELEASED]: https://github.com/PsychoLlama/retreon/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/PsychoLlama/retreon/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/PsychoLlama/retreon/releases/tag/v0.1.0
