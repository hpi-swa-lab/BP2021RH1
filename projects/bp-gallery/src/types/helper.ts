export type KeysWithValueExtending<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T] &
  keyof any;
