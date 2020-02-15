# Retreon
A delightful redux toolkit.

---

## Project Status
:warning: Experimental

The API is evolving and unstable. Beware of dragons :dragon:

## Why
Redux is a phenomenally powerful tool, and it can be a true joy to work with. But
it takes time to find good tooling and develop healthy patterns.

Retreon aims to provide good patterns and tools out of the box.

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
