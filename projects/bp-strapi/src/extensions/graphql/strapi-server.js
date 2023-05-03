const {
  authStrategy,
} = require("../../parameterizedPermissions/authStrategy.js");

module.exports = (plugin) => {
  strapi.container.get("auth").register("content-api", authStrategy);
  return plugin;
};
