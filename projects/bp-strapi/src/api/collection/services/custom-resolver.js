'use strict';

const resolveCollectionThumbnail = async (strapi, collectionId, alreadySeenIds) => {
  alreadySeenIds.push(collectionId);
  const collectionQuery = strapi.db.query('api::collection.collection');
  const response = await collectionQuery.findOne({
    where: {
      id: collectionId,
    },
    select: ['id'],
    populate: {
      pictures: {
        select: ['id'],
        limit: 1,
        populate: {
          media: {
            select: ['formats'],
          },
        },
      },
      child_collections: {
        select: ['id'],
      },
    },
  });

  if (response.pictures[0] && response.pictures[0].media.formats) {
    const formats = response.pictures[0].media.formats;
    const targetFormat = formats.medium || formats.small || formats.thumbnail;
    return targetFormat ? targetFormat.url : null;
  } else {
    for (const child of response.child_collections) {
      if (alreadySeenIds.includes(child.id)) {continue; }
      const thumb = await resolveCollectionThumbnail(strapi, child.id, alreadySeenIds);
      if (thumb) {
        return thumb;
      }
    }
  }
  return null;
};

const mergeSourceCollectionIntoTargetCollection = async (strapi, sourceId, targetId) => {
  const collectionQuery = strapi.db.query('api::collection.collection');

  const getCollection = async (id) => {
    return collectionQuery.findOne({
      where: { id },
      populate: {
        pictures: {
          select: ['id'],
        },
        child_collections: {
          select: ['id'],
        },
        parent_collections: {
          select: ['id']
        }
      },
    });
  };

  const source = await getCollection(sourceId);
  const target = await getCollection(targetId);

  const newPicturesForTarget = [
    ...new Set([
      ...target.pictures.map(pic => pic.id),
      ...source.pictures.map(pic => pic.id),
    ]),
  ];

  const newChildCollectionsForTarget = [
    ...new Set([
      ...target.child_collections.map(collection => collection.id),
      ...source.child_collections.map(collection => collection.id),
    ]),
  ];

  let newDescriptionForTarget = null;
  if (target.description && source.description) {
    newDescriptionForTarget =
      `${target.description}<br/><br/>${source.description}`;
  } else if (target.description || source.description) {
    newDescriptionForTarget =
      `${target.description || source.description}`;
  }


  const data = {
    pictures: newPicturesForTarget,
      child_collections: newChildCollectionsForTarget,
      description: newDescriptionForTarget,
  }
  // Handles edge case: source collection is the only parent of target collection
  if (target.parent_collections.filter(collection => collection.id !== source.id).length === 0) {
   data.parent_collections = source.parent_collections;
  }

  const updatedTarget = await collectionQuery.update({
    where: {
      id: targetId,
    },
    data,
  });
  strapi.log.debug(
    `Merged the collection with id ${sourceId} into the collection with id ${targetId}`
  );

  await collectionQuery.delete({
    where: {
      id: sourceId,
    },
  });
  strapi.log.debug(`Deleted the collection with id ${sourceId}`);

  return updatedTarget.id;
};

module.exports = {
  mergeSourceCollectionIntoTargetCollection,
  resolveCollectionThumbnail,
};
