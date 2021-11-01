'use strict';

const { sanitizeEntity, convertRestQueryParams, buildQuery } = require("strapi-utils/lib");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
module.exports = {
    async find(ctx) {
        const params = convertRestQueryParams(ctx.query);
        const catField = params.where?.find(field => field.field === 'categories') || null;
        if (catField) {
            const category_ids = (await strapi.connections.default.raw(`
            select distinct "pictures".id from "pictures" 
                left join "bp-strapi"."public"."category_tags_pictures__pictures_category_tags" as "category_tags_pictures__pictures_category_tags_1" 
                    on "category_tags_pictures__pictures_category_tags_1"."picture_id" = "pictures"."id" 
                left join "bp-strapi"."public"."category_tags" as "category_tags_1" 
                    on "category_tags_pictures__pictures_category_tags_1"."category-tag_id" = "category_tags_1"."id"
                WHERE "category_tags_1"."id" IN (${catField.value.join(',')})
                GROUP BY "pictures"."id"
                HAVING COUNT(*)=${catField.value.length}
            `)).rows.map(row => row.id);
            params.where.splice(params.where.indexOf(catField), 1);
            params.where.push({
                field: 'id',
                operator: 'in',
                value: category_ids
            });
            console.log(params);
        }
        const find = (params, populate, { transacting } = {}) => {
            const filters = params;
            const query = buildQuery({ model: strapi.models['picture'], filters });
        
            return strapi.models['picture']
                .query(query)
                .fetchAll({
                withRelated: populate,
                transacting,
                publicationState: filters.publicationState,
                })
                .then(results => results.toJSON());
        }

        const entities = await find(params);
        return entities.map(entity => sanitizeEntity(entity, { model: strapi.models['picture'] }));
    }
}

