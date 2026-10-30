import { noop } from 'lodash';
import type { StrapiContext } from '../../types';

export const wrap = <Args extends unknown[], Key extends keyof any>(
  object: { [K in Key]: (...args: Args) => Promise<void> },
  key: Key,
  wrapper: (inner: (...args: Args) => Promise<void>, ...args: Args) => Promise<void>
) => {
  const inner = object[key];
  object[key] = async (...args: Args) => {
    await wrapper(inner ?? noop, ...args);
  };
};

type AuthController = Record<
  'register' | 'changePassword' | 'resetPassword' | 'forgotPassword',
  (ctx: StrapiContext) => Promise<void>
>;

export const getAuthController = () => {
  return strapi.plugin('users-permissions').controllers.auth as unknown as AuthController;
};
