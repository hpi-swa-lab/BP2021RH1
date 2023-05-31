import {
  validateForgotPasswordBody,
  validateResetPasswordBody,
} from '@strapi/plugin-users-permissions/server/controllers/validation/auth';

export const enablePasswordTokenExpiration = (config: {
  resetPasswordTokenExpirationTimeMilliseconds: number;
}) => {
  const authController = strapi.plugin('users-permissions').controllers.auth;

  const innerResetPassword = authController.resetPassword;
  authController.resetPassword = async ctx => {
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

    await innerResetPassword(ctx);
  };

  const innerForgotPassword = authController.forgotPassword;
  authController.forgotPassword = async ctx => {
    const { email } = await validateForgotPasswordBody(ctx.request.body);

    await innerForgotPassword(ctx);

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
  };
};
