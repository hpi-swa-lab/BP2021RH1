import {
  validateForgotPasswordBody,
  validateResetPasswordBody,
} from '@strapi/plugin-users-permissions/server/controllers/validation/auth';
import { getAuthController, wrap } from './helper';

export const enablePasswordTokenExpiration = (config: {
  resetPasswordTokenExpirationTimeMilliseconds: number;
}) => {
  const authController = getAuthController();

  wrap(authController, 'resetPassword', async (inner, ctx) => {
    const { code } = await validateResetPasswordBody(ctx.request.body);

    const userQuery = strapi.query('plugin::users-permissions.user');
    const user = await userQuery.findOne({ where: { resetPasswordToken: code } });

    if (user) {
      const createdAt = new Date(user.resetPasswordTokenCreatedAt);
      const millisecondsSinceCreated = +new Date() - +createdAt;
      if (millisecondsSinceCreated > config.resetPasswordTokenExpirationTimeMilliseconds) {
        // invalidate the token
        await userQuery.update({
          where: {
            id: user.id,
          },
          data: { resetPasswordToken: null, resetPasswordTokenCreatedAt: null },
        });
      }
    }

    await inner(ctx);
  });

  wrap(authController, 'forgotPassword', async (inner, ctx) => {
    const { email } = await validateForgotPasswordBody(ctx.request.body);

    await inner(ctx);

    const userQuery = strapi.query('plugin::users-permissions.user');
    const user = await userQuery.findOne({ where: { email: email.toLowerCase() } });

    if (user && user.resetPasswordToken) {
      await userQuery.update({
        where: {
          id: user.id,
        },
        data: { resetPasswordTokenCreatedAt: new Date() },
      });
    }
  });
};
