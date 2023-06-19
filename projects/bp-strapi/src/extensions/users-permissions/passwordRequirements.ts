import {
  validateChangePasswordBody,
  validateRegisterBody,
  validateResetPasswordBody,
} from '@strapi/plugin-users-permissions/server/controllers/validation/auth';
import { StrapiContext } from '../../types';
import { getAuthController, wrap } from './helper';

const minimumPasswordLength = 12;
const minimumCharacterClasses = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/];

const fulfillsPasswordRequirements = (password: string) => {
  if (password.length < minimumPasswordLength) {
    return false;
  }
  if (!minimumCharacterClasses.every(characterClass => password.match(characterClass))) {
    return false;
  }
  return true;
};

export const enforcePasswordRequirements = (password: string) => {
  if (!fulfillsPasswordRequirements(password)) {
    throw new Error(
      `password must be at least ${minimumPasswordLength} characters long ` +
        'and must contain at least a small letter, a capital letter, a number and a special character'
    );
  }
};

export const enablePasswordRequirements = () => {
  const authController = getAuthController();

  wrap<[StrapiContext], 'register'>(authController, 'register', async (inner, ctx) => {
    const { password } = await validateRegisterBody(ctx.request.body);
    enforcePasswordRequirements(password);
    await inner(ctx);
  });

  wrap<[StrapiContext], 'changePassword'>(authController, 'changePassword', async (inner, ctx) => {
    const { password } = await validateChangePasswordBody(ctx.request.body);
    enforcePasswordRequirements(password);
    await inner(ctx);
  });

  wrap<[StrapiContext], 'resetPassword'>(authController, 'resetPassword', async (inner, ctx) => {
    const { password } = await validateResetPasswordBody(ctx.request.body);
    enforcePasswordRequirements(password);
    await inner(ctx);
  });
};
