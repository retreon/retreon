import { createReducer } from 'retreon';

import * as news from './actions';

type State = {
  currentPage: number;
  loading: boolean;
  results: Array<NewsResult>;
};

export type NewsResult = {
  headline: string;
  url: string;
  id: number;
  upvotes: number;
};

export const initialState: State = {
  currentPage: 0,
  loading: false,
  results: [],
};

// TODO: Fix payload type inference.
export default createReducer(initialState, (handleAction) => [
  handleAction.optimistic(news.loadPage, (state, page) => {
    state.loading = true;
    state.currentPage = page;
    state.results = [];
  }),

  handleAction(news.loadPage, (state, results) => {
    state.loading = false;
    state.results = results;
  }),

  handleAction.optimistic(news.upvote, (state, { id }) => {
    const result = state.results.find((result) => result.id === id);
    if (result) result.upvotes++;
  }),
]);
