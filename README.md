<div align="center">
  <h1>retreon</h1>
  <p>A delightful, type-safe redux toolkit.</p>

  <a href="https://github.com/PsychoLlama/retreon/actions?query=workflow%3A%22Continuous+Integration%22"><img alt="Build status" src="https://img.shields.io/github/workflow/status/PsychoLlama/retreon/Continuous Integration/master" /></a>
  <a href="https://www.npmjs.com/package/retreon/"><img alt="npm" src="https://img.shields.io/npm/v/retreon" /></a>
  <a href="https://bundlephobia.com/result?p=retreon"><img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/retreon?color=teal" /></a>
</div>

---

## Purpose
Redux is a phenomenally powerful tool, and it can be a true joy to work with. But it takes time to find good tooling and develop healthy patterns.

Retreon aims to provide good patterns and strong types out of the box, including tools for async actions and error handling. Retreon is [FSA compliant](https://github.com/redux-utilities/flux-standard-action#readme).

Here's a taste:

```ts
// actions.ts
const changeTheme = createAction('change-theme', (theme: Theme) => {
  localStorage.setItem('theme-preference', theme);
  return theme
})
```

```ts
// reducer.ts
const reducer = createReducer({ theme: 'light' }, handleAction => [
  handleAction(changeTheme, (state, theme) => {
    state.theme = theme
  }),
])
```

If you prefer to learn by example, take a gander at [the examples directory](https://github.com/retreon/retreon/tree/master/examples), or check out [TodoMVC](https://github.com/retreon/todomvc/) to see a functioning application.

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
- [Examples](https://github.com/retreon/retreon/tree/master/examples)

---

Retreon is inspired by [redux-actions](https://github.com/redux-utilities/redux-actions) and [immer](https://github.com/immerjs/immer).
