const fs = require('fs');
module.exports = async () => {
    const dbSettings = strapi.config.get('database.connection.connection');
    await strapi.destroy();
    if (dbSettings && dbSettings.filename) {
        const tmpDbFile = dbSettings.filename;
        if (fs.existsSync(tmpDbFile)) {
            fs.unlinkSync(tmpDbFile);
        }
    }
    instance = null;
};
