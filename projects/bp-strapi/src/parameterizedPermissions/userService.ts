export const getJwtService = () => {
  return strapi.plugin('users-permissions').service('jwt');
};

export const getUserService = () => {
  return strapi.plugin('users-permissions').service('user');
};
