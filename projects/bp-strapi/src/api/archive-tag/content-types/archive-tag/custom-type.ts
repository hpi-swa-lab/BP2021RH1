import type * as Nexus from "nexus";

export const archivePictureCountsType = (nexus: typeof Nexus) => {
  const { objectType } = nexus;

  return objectType({
    name: "ArchivePictureCountEntityResponseCollection",
    definition(t) {
      t.list.field("data", {
        type: objectType({
          name: "ArchivePictureCountEntity",
          definition(t) {
            t.field("id", {
              type: "ID",
            });
            t.field("attributes", {
              type: objectType({
                name: "ArchivePictureCount",
                definition(t) {
                  t.field("count", { type: "Int" });
                },
              }),
            });
          },
        }),
      });
    },
  });
};
