type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;

type ArrayChildren<T extends object> = keyof {
  [K in keyof T as IfAny<T[K], never, T[K] extends T[] | undefined ? K : never>]: T[K];
};

export const getDescendants = <T extends { id: string }>(
  parent: T,
  childrenKey: ArrayChildren<T>,
  descendants: string[] = []
): string[] => {
  const children = parent[childrenKey] as T[] | undefined;
  if (!children) return [];
  descendants.push(...children.map(childComment => childComment.id));
  children.forEach(childComment => getDescendants(childComment, childrenKey, descendants));
  return descendants;
};
