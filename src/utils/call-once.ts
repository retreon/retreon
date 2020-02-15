// Kind of like `memoize(...)` except it doesn't check parameter equality.
const callOnce = <Fn extends Function>(fn: Fn): Fn => {
  const cache = { primed: false, value: null };

  const cachingLayer = (...args: any) => {
    if (!cache.primed) {
      cache.value = fn(...args);
      cache.primed = true;
    }

    return cache.value;
  };

  return cachingLayer as any;
};

export default callOnce;
