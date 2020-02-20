<div align="center">
  <h1>retreon</h1>
  <p>A delightful, type-safe redux toolkit.</p>

  <a href="https://travis-ci.org/PsychoLlama/retreon/branches"><img alt="Build status" src="https://img.shields.io/travis/PsychoLlama/retreon/master?label=Travis%20CI" /></a>
  <a href="https://www.npmjs.com/package/retreon/"><img alt="npm" src="https://img.shields.io/npm/v/retreon" /></a>
  <a href="https://bundlephobia.com/result?p=retreon"><img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/retreon?color=teal" /></a>
</div>

---

## Project Status
:warning: Experimental

The API is evolving and unstable.

## Purpose
Redux is a phenomenally powerful tool, and it can be a true joy to work with. But
it takes time to find good tooling and develop healthy patterns.

Retreon aims to provide good patterns and strong types out of the box. Error
handling, async actions, and state changes are first class citizens.

Retreon is [FSA compliant](https://github.com/redux-utilities/flux-standard-action#readme).

## [Examples](https://github.com/PsychoLlama/retreon/tree/master/src/examples)
For a quick introduction, take a look at some [retreon
examples](https://github.com/PsychoLlama/retreon/tree/master/src/examples).

## Documentation
> :construction: documentation is a work in progress.

The API revolves around two functions: `createAction(...)` and
`createReducer(...)`. If you've ever used
[redux-actions](https://github.com/redux-utilities/redux-actions), it will
probably feel familiar. Here's how it looks in practice...

```js
import { addTask, createReducer } from 'retreon'

// Define redux actions using `createAction(...)`
const changeTheme = createAction<string>('change-theme')

// Create a reducer to handle that action.
const reducer = createReducer({ theme: 'light' }, handleAction => [
  handleAction(changeTheme, (state, theme) => {
    state.theme = theme
  }),
])
```

Note: mutation is okay. Reducers are wrapped with
[immer](https://github.com/immerjs/immer). The changes are applied immutably.

Optionally you can pass a function to run when the action gets invoked. That's
your side effect.

```js
// Check there.
const save = createAction('settings/save', (settings: Settings) => {
  localStorage.setItem('settings', JSON.stringify(settings))
})
```

### Error handling
If something goes wrong, retreon exposes a special function called
`failure(...)`. Use that to mark the action failed.

```js
import { createAction, failure } from 'retreon'

createAction('settings/save', (settings: Settings) => {
  try {
    localStorage.setItem('settings', JSON.stringify(settings))
    return { success: 'yey' }
  } catch {
    return failure({ alternative: 'payload' })
  }
})
```

Retreon will **not** swallow errors. You have to explicitly return
`failure(...)` indicating the error is expected.

To handle errors in your reducer, use `handleAction.error(...)`:
```js
import * as settings from '../actions/settings'

createReducer(initialState, handleAction => [
  handleAction(settings.save, (state, payload) => {
    // Only handles success.
  }),

  // The payload is whatever you passed to `failure(...)`.
  handleAction.error(settings.save, (state, payload) => {
    // Only handles failure.
  }),
])
```

### Async actions
Async actions are still experimental. They're implemented through a custom
redux middleware. It intercepts and consumes all dispatched async iterators.

```js
async function* actionSequence() {
  yield { type: 'action-1' }
  yield { type: 'action-2' }
  yield { type: 'action-3' }

  return 'resolve value'
}

await store.dispatch(actionSequence())
```

Async actions are created with `createAction.async(...)`.

```js
const loadUser = createAction.async('users/load', async (id: string) => {
  const response = await fetch(`/users/${id}/`)
  const user = await response.json()

  return { user, id }
})
```

If it resolves, the action goes through `handleAction(...)`. If it fails,
well, that hasn't been implemented yet. But it'll probably go through
`handleAction.error(...)`. TODO.

In addition, async action creators dispatch immediately so you can
optimistically update state (like setting a `loading` flag or invalidating the
cache). Listen for it using `handleAction.optimistic(...)`.

```js
createReducer(initialState, handleAction => [
  handleAction.optimistic(loadUser, (state, id) => {
    state.loading = true
  }),

  handleAction(loadUser, (state, { user, id }) => {
    state.loading = false
    state.users[id] = user
  }),
])
```

And that concludes the API. Thank you for flying retreon airlines.

## Roadmap
- [ ] Async error handling
- [ ] Improved documentation
- [ ] More examples

## Prior Art
Retreon is inspired by
[redux-actions](https://github.com/redux-utilities/redux-actions) and
[immer](https://github.com/immerjs/immer).
