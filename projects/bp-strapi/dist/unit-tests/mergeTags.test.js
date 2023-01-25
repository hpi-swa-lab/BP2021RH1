const { setupTestData, cleanUpTestData } = require("./helpers/setupTestData");
const { mergeSourceTagIntoTargetTag, } = require("../src/api/custom-tag-resolver");
const TAG_TYPES = [
    "location-tag",
    "person-tag",
    "keyword-tag"
];
describe("Merge different tag types", () => {
    beforeAll(async () => {
        await setupTestData();
    });
    afterAll(async () => {
        await cleanUpTestData();
    });
    TAG_TYPES.map(tagType => describe(`${tagType}s`, () => {
        const tagQuery = strapi.db.query(`api::${tagType}.${tagType}`);
        const tagService = strapi.service(`api::${tagType}.${tagType}`);
        beforeAll(async () => {
            await tagService.create({
                data: {
                    name: `${tagType} 1`,
                    pictures: [1, 2],
                    verified_pictures: [3, 4, 5],
                    synonyms: [
                        {
                            name: "Synonym 1",
                        },
                    ],
                },
            });
            await tagService.create({
                data: {
                    name: `${tagType} 2`,
                    pictures: [5, 6],
                    verified_pictures: [7, 8],
                    synonyms: [
                        {
                            name: "Synonym 2",
                        },
                    ],
                },
            });
        });
        afterAll(async () => {
            await tagQuery.deleteMany({});
        });
        it("should be merged correctly", async () => {
            await mergeSourceTagIntoTargetTag(strapi, tagType, 1, 2);
            const source = await tagQuery.findOne({ where: { id: 1 } });
            expect(source).toBeNull();
            const target = await tagQuery.findOne({
                where: { id: 2 },
                populate: {
                    pictures: {
                        select: ["id"],
                    },
                    verified_pictures: {
                        select: ["id"],
                    },
                    synonyms: {
                        select: ["name"],
                    },
                },
            });
            expect(target).not.toBeNull();
            expect(target.pictures.map(p => p.id).sort()).toEqual([1, 2, 6]);
            expect(target.verified_pictures.map(p => p.id).sort()).toEqual([3, 4, 5, 7, 8]);
            expect(target.synonyms.map(p => p.name)).toEqual(["Synonym 2", "Synonym 1"]);
        });
    }));
});
