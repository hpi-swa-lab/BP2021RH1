import { getService } from '@strapi/plugin-users-permissions/server/utils/index.js';

export const getJwtService = () => {
  return getService('jwt');
};

export const getUserService = () => {
  return getService('user');
};
