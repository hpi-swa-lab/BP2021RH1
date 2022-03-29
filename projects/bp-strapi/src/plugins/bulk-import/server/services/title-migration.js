'use strict';

module.exports = ({ strapi }) => ({
    async migrateTitles() {
        const titleQuery = strapi.db.query('api::title.title');
        const descriptionService = strapi.service('api::description.description');

        const titles = await titleQuery.findMany({
            select: ['id', 'text'],
            populate: {
                pictures: {
                    select: [],
                    populate: {
                        descriptions: {
                            select: ['text'],
                        }
                    }
                }
            },
        });

        // Step 1: Filter out titles with text related to upload dates
        const regex = /(\d{4})-(\d{2}-){4}(\d{4})/gm;
        let filteredTitles = titles.filter(title => !title.text.match(regex));

        // Step 2: Filter out exact match of title text in descriptions
        filteredTitles = filteredTitles.filter(title => {
            for (const picture of title.pictures) {
                for (const description of picture.descriptions) {
                    if (description.text.toLowerCase().trim().includes(title.text.toLowerCase().trim())) return false;
                }
            }

            return true;
        })

        // Step 3: Join strings that are basically the same just with a number
        const seenTitles = [];
        filteredTitles.filter(title => {
            const sm = (s) => s.replace(/(.*)[-|_]\d{1,2}$/gm, (_, group1) => `${group1}`).toLowerCase();
            const firstMatchingSeenTitle = seenTitles.find(seenTitle => seenTitle.text === sm(title.text))
            if (firstMatchingSeenTitle) {
                firstMatchingSeenTitle.pictures = firstMatchingSeenTitle.pictures.concat(title.pictures);
                title.ersetztDurch = firstMatchingSeenTitle.text;
                title.ersetztDurchId = firstMatchingSeenTitle.id;
                return true;
            }
            title.text = sm(title.text);
            seenTitles.push(title);
            return false;
        });
        filteredTitles = seenTitles;

        // Convert titles to descriptions
        for (const title of filteredTitles) {
          const response = await descriptionService.create({
            data: {
              text: `<h1>${title.text}</h1>`,
              pictures: title.pictures.map(p => p.id)
            }
          });
          strapi.log.debug(`Converted title ${title.id} (${title.text}) into description with id ${response.id}`);
        }

        // Delete **all** titles
        for (const title of titles) {
          strapi.log.debug(`Deleting title ${title.id}: ${title.text}`);
          await titleQuery.delete({
            where: { id: title.id }
          });
        }

        // Delte title-picture relation field in content type (do manually)
        // Delete title content type (do manually)

        // Cleanup response
        filteredTitles = filteredTitles.map(title => ({ id: title.id, text: title.text }));

        return {
            filteredTitles,
            filteredCount: filteredTitles.length,
            count: titles.length
        };
    },
});
