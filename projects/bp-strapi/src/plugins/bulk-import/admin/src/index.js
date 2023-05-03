import pluginPkg from '../../package.json';
import pluginId from './pluginId';

const name = pluginPkg.strapi.name;

/* eslint-disable no-unused-vars */
export default {
  register(app) {
    app.registerPlugin({
      id: pluginId,
      name,
    });
  },

  bootstrap(app) {},
};
