<div align="center">
  <h1>retreon</h1>
  <p>A type-safe, batteries-included redux toolkit.</p>

  <a href="https://github.com/retreon/retreon/actions?query=workflow%3ATest"><img alt="Build status" src="https://img.shields.io/github/workflow/status/retreon/retreon/Test/main" /></a>
  <a href="https://www.npmjs.com/package/retreon/"><img alt="npm" src="https://img.shields.io/npm/v/retreon" /></a>
  <a href="https://bundlephobia.com/result?p=retreon"><img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/retreon?color=teal" /></a>
</div>

---

## Project Status
:no_entry: UNMAINTAINED

State management is still heavily evolving in React. While I believe Retreon is one of the best ways to use Redux, the community is modernizing towards modular hook-based libraries.

I would recommend exploring [Recoil](https://recoiljs.org/), [Jotai](https://jotai.org/), or any of the newer approaches.

## Purpose
Redux is a phenomenally powerful tool, and it can be a true joy to work with. But it takes time to find good tooling and develop healthy patterns.

Retreon aims to provide good patterns and strong types out of the box, including tools for async actions and error handling. Retreon is [FSA compliant](https://github.com/redux-utilities/flux-standard-action#readme).

Here's a taste:

```typescript
// actions.ts
const fetchResource = createAction.async('fetch-resource', async (id: number) => {
  const response = await fetch(`/resources/${id}`)
  return response.json()
})
```

```typescript
// reducer.ts
const reducer = createReducer(initialState, handleAction => [
  // Called as soon as the action starts
  handleAction.optimistic(fetchResource, (state, resourceId) => {
    state.loading = true
  }),

  // Optionally, handle errors if your action fails
  handleAction.error(fetchResource, (state, error) => {
    state.loading = false
  }),

  // Called when the action's promise resolves, passing the payload
  handleAction(fetchResource, (state, resource) => {
    state.loading = false
    state.resource = resource
  }),
])
```

If you prefer to learn by example, take a gander at [the examples directory](https://github.com/retreon/retreon/tree/main/examples), or check out [TodoMVC](https://retreon.github.io/todomvc/) to see a functioning application.

## Installation
Retreon can be installed through npm.

```bash
# NPM
npm install retreon

# Yarn
yarn add retreon
```

Retreon depends on middleware to implement async actions and error handling. Once it's installed, register it with your redux store:

```ts
// Wherever you create your redux store...
import { middleware } from 'retreon'

createStore(reducer, applyMiddleware(middleware))
```

## Documentation
Documentation is hosted on [the retreon website](https://retreon.archetype.foundation):

- [API](https://retreon.archetype.foundation/creating-actions)
- [Examples](https://github.com/retreon/retreon/tree/main/examples)

---

Retreon is inspired by [redux-actions](https://github.com/redux-utilities/redux-actions) and [immer](https://github.com/immerjs/immer).
