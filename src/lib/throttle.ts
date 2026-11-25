let queue: Promise<unknown> = Promise.resolve();

/** Cola en serie: 300 ms entre requests (Jolpica permite ~4/s). */
export function throttled<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn);
  queue = run.catch(() => {}).then(() => new Promise((r) => setTimeout(r, 300)));
  return run;
}
