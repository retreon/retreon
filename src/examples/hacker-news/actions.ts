import { createAction } from '../../index';
import http from './http';
import { NewsResult } from './reducer';

export const loadPage = createAction.async(
  'news/load-page',
  async (page: number) => {
    const response = await http.get(`/news/?page=${page}`);
    return response.data as Array<NewsResult>;
  },
);

export const upvote = createAction.async(
  'news/upvote',
  async ({ id }: { id: number }) => {
    await http.post(`/news/article/${id}/upvote/`);
    // TODO: Add error handling.
  },
);
