'use strict';

module.exports = ({ strapi }) => ({
  async migrateCollections() {
    
    const categoryTagQuery = strapi.db.query('api::category-tag.category-tag');

    const collectionsService = strapi.service('api::collection.collection');
    const collectionsQuery = strapi.db.query('api::collection.collection');

    const categories = await categoryTagQuery.findMany({
      select: ['id', 'name', 'description'],
      populate: {
          pictures: {
              select: ['id']
          },
          related_tags: {
            select: ['id']
          }
      },
    });

    for (const category of categories) {
      const response = await collectionsService.create({
        data: {
          name: category.name,
          description: category.description,
          pictures: category.pictures.map(p => p.id)
        }
      });
      strapi.log.debug(`Converted category ${category.id} (${category.name}) into collection with id ${response.id}`);
      category.collectionId = response.id;
    }

    // Create child relations
    for (const category of categories) {
      const childIds = category.related_tags.map(tag => categories.find(cat => cat.id === tag.id).collectionId);
      await collectionsQuery.update({
        where: {id: category.collectionId },
        data: {
          child_collections: childIds
        }
      });
      strapi.log.debug(`Built relations for category ${category.id}`);
    }

    categoryTagQuery.deleteMany({});

		// TODO
		return {
      categories,
      count: categories.length
    };
	}
});
