export interface AsynchronouslyIterable<
  T,
  C extends object = object,
  I = unknown,
> {
  init(instance: C, iterator: AsyncIterableIterator<T> & I): void;
  next(
    instance: C,
    iterator: AsyncIterableIterator<T> & I,
  ): Promise<IteratorResult<T>>;
}

interface PairAsynchronouslyIterableDeclaration<K, V> {
  keys(): AsyncIterableIterator<K>;
  entries(): AsyncIterableIterator<[K, V]>;
}

export interface ValueAsyncIterable<T> {
  [Symbol.asyncIterator](): AsyncIterableIterator<T>;
  values(): AsyncIterableIterator<T>;
}

export interface PairAsyncIterable<K, V>
  extends PairAsynchronouslyIterableDeclaration<K, V> {
  [Symbol.asyncIterator](): AsyncIterableIterator<[K, V]>;
  values(): AsyncIterableIterator<V>;
}

export function asynciterator<
  K,
  V,
  C extends object = object,
  I = unknown,
>(
  definition: AsynchronouslyIterable<[K, V], object, I>,
): (target: object, context: ClassDecoratorContext) => void {
  return (target, context) => {
    function iter(this: object) {
      const scopedThis = this;

      const iterator = {
        next() {
          return definition.next(scopedThis, this);
        },
        [Symbol.asyncIterator]() {
          return this;
        },
      } satisfies AsyncIterableIterator<[K, V]>;

      definition.init(this, iterator);

      return iterator;
    }

    async function* keys(this: object) {
      for await (const [key] of iter.bind(this)()) yield key;
    }

    async function* values(this: object) {
      for await (const [_, value] of iter.bind(this)()) yield value;
    }

    target.prototype[Symbol.asyncIterator] = iter;
    target.prototype.keys = keys;
    target.prototype.values = values;
    target.prototype.entries = target.prototype[Symbol.asyncIterator];
  };
}
