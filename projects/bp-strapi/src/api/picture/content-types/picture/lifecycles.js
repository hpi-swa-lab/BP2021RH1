module.exports = {
  async beforeUpdate(event) {
    const { data, where } = event.params;

    console.log(event);

    if (!data || !data.title) return;

    const titleObject = JSON.parse(data.title);
    console.log(titleObject);

    if (!titleObject.customUpload) return;

    const titleQuery = strapi.db.query("api::title.title");
    const titleService = strapi.service("api::title.title");

    const pictureQuery = strapi.db.query("api::picture.picture");

    let newTitleId;
    const newTitleInDB = await titleQuery.findOne({
      where: {
        text: {
          $containsi: titleObject.text,
        },
      },
    });
    console.log("New title already in DB: " + newTitleInDB);

    if (newTitleInDB) {
      newTitleId = newTitleInDB.id;
      console.log("Use of existing title, id: " + newTitleInDB.id);
    } else {
      const createdTitle = await titleService.create({
        data: {
          text: titleObject.text,
        },
      });
      if (createdTitle) newTitleId = createdTitle.id;
      console.log("Use of created title, id: " + createdTitle.id);
    }

    // delete old title entity if picture was the only one related to it
    const thisPicture = await pictureQuery.findOne({
      populate: true,
      //   select: ["title"],  //whats my mistake here?
      where: {
        id: where.id,
      },
    });
    const oldTitleInDB = thisPicture.title.id;

    const picturesWithOldTitle = await pictureQuery.findMany({
      where: { title: oldTitleInDB },
    });
    console.log(picturesWithOldTitle.length);
    if (picturesWithOldTitle.length < 2) {
      await titleQuery.delete({
        where: { id: oldTitleInDB },
      });
      console.log("Deleted old title, id " + oldTitleInDB);
    }

    // add fallback - if input is not valid, the title is deleted
    event.params.data.title = newTitleId;
  },
};
