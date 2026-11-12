import { authStrategy } from '../../parameterizedPermissions/authStrategy';

export const registerParameterizedPermissionsAuthStrategy = () => {
  strapi.get('auth').register('content-api', authStrategy);
};
