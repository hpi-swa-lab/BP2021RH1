import { isObject, mapValues } from 'lodash';

const singular = (key: string) => {
  if (key[key.length - 1] !== 's') {
    return key;
  }
  return key.slice(0, -1);
};

const plural = (key: string) => {
  if (key[key.length - 1] === 's') {
    return key;
  }
  return key + 's';
};

const DATABASE_SCHEMA = process.env.DATABASE_SCHEMA;

const table = (name: string) => {
  return DATABASE_SCHEMA + '.' + name;
};

type DeepStringifyIds<T> = T extends object
  ? {
      [K in keyof T]: K extends 'id' ? string : DeepStringifyIds<T[K]>;
    }
  : T;

const deepStringifyIds = <T extends object>(object: T): DeepStringifyIds<T> =>
  (object instanceof Array
    ? object.map(deepStringifyIds)
    : isObject(object)
    ? mapValues<T, unknown>(object, (value, key) =>
        key === 'id' && typeof value === 'number'
          ? (value as number).toString()
          : isObject(value)
          ? deepStringifyIds(value)
          : value
      )
    : object) as DeepStringifyIds<T>;

export { deepStringifyIds, plural, singular, table };
