const ARRAY_BRACKETS = '[]';

export const toURLSearchParam = (param: string) => param + ARRAY_BRACKETS;

export const fromURLSearchParam = (param: string) =>
  param.endsWith(ARRAY_BRACKETS) ? param.slice(0, -ARRAY_BRACKETS.length) : param;
