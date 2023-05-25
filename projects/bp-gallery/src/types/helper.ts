export type MutationFunction<T extends (...args: never[]) => [unknown, unknown]> = ReturnType<T>[0];
