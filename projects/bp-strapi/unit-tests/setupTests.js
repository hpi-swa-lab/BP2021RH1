const { setupStrapi } = require('./helpers/strapi');
const fs = require('fs');

jest.setTimeout(15000)

beforeAll(async () => {
  instance = await setupStrapi();
});

afterAll(async () => {
  await cleanUp();
});

async function cleanUp() {
  const dbSettings = instance.config.get('database.connection.connection');

  await instance.destroy();

  if (dbSettings && dbSettings.filename) {
    const tmpDbFile = dbSettings.filename;
    console.log(tmpDbFile);
    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
}
