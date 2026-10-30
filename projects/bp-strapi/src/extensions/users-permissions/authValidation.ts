import path from 'path';

// The plugin's package.json only exports its entry points, so load the file by its path.
const pluginDirectory = path.dirname(
  require.resolve('@strapi/plugin-users-permissions/package.json')
);

export const {
  validateChangePasswordBody,
  validateForgotPasswordBody,
  validateRegisterBody,
  validateResetPasswordBody,
}: {
  validateForgotPasswordBody: (body: unknown) => Promise<{ email: string }>;
  validateResetPasswordBody: (body: unknown) => Promise<{ code: string; password: string }>;
  validateChangePasswordBody: (body: unknown) => Promise<{ password: string }>;
  validateRegisterBody: (body: unknown) => Promise<{ password: string }>;
} = require(path.join(pluginDirectory, 'server/controllers/validation/auth'));
