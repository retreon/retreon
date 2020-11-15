import http from './http';
import { NewsResult } from './reducer';

export async function loadPage(page: number) {
  const response = await http.get(`/news/?page=${page}`);
  return response.data as Array<NewsResult>;
}

export async function upvote({ id }: { id: number }) {
  await http.post(`/news/article/${id}/upvote/`);
}
