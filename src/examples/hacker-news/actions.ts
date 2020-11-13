import { createAction } from '../../index';
import * as effects from './effects';

export const loadPage = createAction.async('news/load-page', effects.loadPage);
export const upvote = createAction.async('news/upvote', effects.upvote);
