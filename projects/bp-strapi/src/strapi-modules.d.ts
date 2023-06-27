declare module '@strapi/utils' {
  export const errors: {
    UnauthorizedError: typeof Error;
  };

  export const env: (name: string) => string;
}

declare module '@strapi/admin/server/strategies/admin' {
  export const authenticate: (ctx: StrapiContext) => Promise<{ authenticated?: boolean }>;
}

declare module '@strapi/plugin-users-permissions/server/controllers/validation/auth' {
  export const validateForgotPasswordBody: (body: unknown) => { email: string };
  export const validateResetPasswordBody: (body: unknown) => {
    code: string;
    password: string;
  };
  export const validateChangePasswordBody: (body: unknown) => {
    password: string;
  };
  export const validateRegisterBody: (body: unknown) => {
    password: string;
  };
}
