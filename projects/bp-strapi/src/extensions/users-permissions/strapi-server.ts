import { enablePasswordTokenExpiration } from './resetPasswordTokenExpiration';

export default plugin => {
  return {
    ...plugin,
    async register(...args) {
      await plugin.register(...args);

      enablePasswordTokenExpiration(plugin.config);
    },
  };
};
