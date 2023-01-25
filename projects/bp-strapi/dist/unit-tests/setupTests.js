const Strapi = require('@strapi/strapi');
global.instance = null;
async function setupStrapi() {
    if (!instance) {
        await Strapi().start();
        instance = strapi;
    }
    return instance;
}
module.exports = async () => {
    instance = await setupStrapi();
};
