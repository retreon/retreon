/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * This isn't a real http interface. Use your imagination.
 */

export default {
  async post<T>(_url: string, _payload?: T): Promise<any> {},
  async get(_url: string): Promise<any> {},
};
