/**
 * Custom errors allow you to attach arbitrary data to standard error objects.
 * They are the recommended method for sending metadata into error reducers.
 */
export class UpvoteError extends Error {
  postId: number;

  constructor(postId: number) {
    super('Failed to upvote user post.');
    this.postId = postId;
  }
}
