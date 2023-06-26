import { authStrategy } from '../../parameterizedPermissions/authStrategy';

export const registerParameterizedPermissionsAuthStrategy = () => {
  strapi.container.get('auth').register('content-api', authStrategy);
};
