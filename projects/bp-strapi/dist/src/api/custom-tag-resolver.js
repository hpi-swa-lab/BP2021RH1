'use strict';
const mergeSourceTagIntoTargetTag = async (strapi, tagKey, sourceId, targetId) => {
    const tagQuery = strapi.db.query(`api::${tagKey}.${tagKey}`);
    const getTag = async (id) => {
        return tagQuery.findOne({
            where: { id },
            populate: {
                pictures: {
                    select: ['id'],
                },
                verified_pictures: {
                    select: ['id'],
                },
                synonyms: {
                    select: ['id'],
                },
            },
        });
    };
    const source = await getTag(sourceId);
    const target = await getTag(targetId);
    const newVerifiedPicturesForTarget = [
        ...new Set([
            ...target.verified_pictures.map(pic => pic.id),
            ...source.verified_pictures.map(pic => pic.id),
        ]),
    ];
    const newUnverifiedPicturesForTarget = [
        ...new Set([
            ...target.pictures.map(pic => pic.id),
            ...source.pictures.map(pic => pic.id),
        ]),
    ].filter(picId => !newVerifiedPicturesForTarget.includes(picId)); // prioritize the verified relation
    const newSynonymsForTarget = [
        ...new Set([
            ...target.synonyms.map(synonym => synonym.id),
            ...source.synonyms.map(synonym => synonym.id),
        ]),
    ];
    const updatedTarget = await tagQuery.update({
        where: {
            id: targetId,
        },
        data: {
            verified_pictures: newVerifiedPicturesForTarget,
            pictures: newUnverifiedPicturesForTarget,
            synonyms: newSynonymsForTarget,
        },
    });
    strapi.log.debug(`Merged the ${tagKey} with id ${sourceId} into the ${tagKey} with id ${targetId}`);
    await tagQuery.delete({
        where: {
            id: sourceId,
        },
    });
    strapi.log.debug(`Deleted the ${tagKey} with id ${sourceId}`);
    return updatedTarget.id;
};
module.exports = {
    mergeSourceTagIntoTargetTag,
};
