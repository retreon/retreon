import { createAction } from 'retreon';

import * as effects from './effects/news';

export const loadPage = createAction.async('news/load-page', effects.loadPage);
export const upvote = createAction.async('news/upvote', effects.upvote);
