type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;

type ArrayChildren<T extends object> = keyof {
  [K in keyof T as IfAny<T[K], never, T[K] extends T[] | undefined ? K : never>]: T[K];
};

export const getDescendants = <
  C extends ArrayChildren<T>,
  T extends { id: string } & { [K in C]: T[] | undefined }
>(
  parent: T,
  childrenKey: C,
  descendants: string[] = []
): string[] => {
  const children = parent[childrenKey];
  if (!children) return [];
  descendants.push(...children.map(childComment => childComment.id));
  children.forEach(childComment => getDescendants(childComment, childrenKey, descendants));
  return descendants;
};
