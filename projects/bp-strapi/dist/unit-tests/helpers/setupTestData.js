const pictureQuery = strapi.db.query('api::picture.picture');
const pictureService = strapi.service('api::picture.picture');
const setupTestData = async () => {
    for (let i = 0; i < 10; i++) {
        await pictureService.create({
            data: {
                wordpress_id: i
            }
        });
    }
};
const cleanUpTestData = async () => {
    await pictureQuery.deleteMany({});
};
module.exports = {
    setupTestData,
    cleanUpTestData
};
