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

The API is evolving and unstable. Beware of dragons :dragon:

## Why
Redux is a phenomenally powerful tool, and it can be a true joy to work with. But
it takes time to find good tooling and develop healthy patterns.

Retreon aims to provide good patterns, strong types, and delightful tools out
of the box.

## Features
```js
import { createAction, createReducer } from 'retreon'

// Define redux actions using `createAction(...)`
const changeTheme = createAction<string>('change-theme')
changeTheme('dark') // { type: 'change-theme', payload: 'dark' }

// Create a reducer to handle that action.
createReducer({ theme: 'light' }, handleAction => [
  handleAction(changeTheme, (state, theme) => {
    state.theme = theme
  }),
])
```

I'll leave the rest of the documentation for my future self. Haha, I hate that
guy.

## Prior Art
Retreon is inspired by
[redux-actions](https://github.com/redux-utilities/redux-actions) and
[immer](https://github.com/immerjs/immer).
