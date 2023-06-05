import { enablePasswordRequirements } from './passwordRequirements';
import { registerParameterizedPermissionsAuthStrategy } from './registerParameterizedPermissionsAuthStrategy';
import { enablePasswordTokenExpiration } from './resetPasswordTokenExpiration';

export default plugin => {
  return {
    ...plugin,
    async register(...args) {
      // before users-permissions registers its own authStrategy,
      // so we have priority in strapi.auth.authenticate
      registerParameterizedPermissionsAuthStrategy();

      await plugin.register(...args);

      enablePasswordTokenExpiration(plugin.config);

      enablePasswordRequirements();
    },
  };
};
