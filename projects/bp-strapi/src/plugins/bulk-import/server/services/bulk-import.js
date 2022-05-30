'use strict';

const fs = require('fs');
const XLSX = require('xlsx');


const parseTimes = (arr) => {
  const months = ['januar', 'februar', 'märz', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'dezember'];
  return arr.map(str => {
    const parts = str.replace(/[\s]+/gm, '').replace(/(januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember)/gmi, (match) => {
      return (months.indexOf(match.toLowerCase())+1) + '.';
    }).split('.');
    if (parts.length > 2) {
      parts[2] = parts[2].replace(/x/gim, '0');
      const start = new Date(`${parts[1]}.${parts[0]}.${parts[2]}`);
      const end = new Date(start);
      end.setDate(end.getDate()+1);
      end.setMilliseconds(end.getMilliseconds()-1);
      return [start, end];
    } else if (parts.length > 1) {
      parts[1] = parts[1].replace(/x/gim, '0');
      const start = new Date(`${parts[0]}.01.${parts[1]}`);
      const end = new Date(start);
      end.setMonth(end.getMonth()+1);
      end.setDate(end.getDate()-1);
      return [start, end];
    } else if (parts[0].match(/[–|\-|bis]/gm)) {
      let [start, end] = parts[0].split(/[\s]*[–|\-|bis][\s]*/gm);
      start = new Date(`${start}`);
      end = new Date(`${end}`);
      end.setFullYear(end.getFullYear()+1);
      end.setDate(end.getDate()-1);
      return [start, end];
    } else {
      if (parts[0][3].toLowerCase() === 'x') {
        let start, end;
        if (parts[0][2].toLowerCase() === 'x'){
          start = new Date(`${parts[0].slice(0,2)}00`);
          end = new Date(start);
          end.setFullYear(end.getFullYear()+100);
          end.setDate(end.getDate()-1);
        } else {
          start = new Date(`${parts[0].slice(0,3)}0`);
          end = new Date(start);
          end.setFullYear(end.getFullYear()+10);
          end.setDate(end.getDate()-1);
        }
        return [start, end];
      }
      const start = new Date(parts[0]);
      const end = new Date(start);
      end.setFullYear(end.getFullYear()+1);
      end.setDate(end.getDate()-1);
      return [start, end];
    }
  });
};

module.exports = ({ strapi }) => ({
  getIndexMessage() {
    return 'The bulk-import plugin just provides some backend-routes.';
  },

  async importAllButCommentsAndTimeRanges(pathToAlbumData, pathToTagInfoData) {
    const keywordTagQuery = strapi.db.query('api::keyword-tag.keyword-tag');
    const keywordTagService = strapi.service('api::keyword-tag.keyword-tag');

    const categoryTagQuery = strapi.db.query('api::category-tag.category-tag');
    const categoryTagService = strapi.service('api::category-tag.category-tag');

    const pictureQuery = strapi.db.query('api::picture.picture');
    const pictureService = strapi.service('api::picture.picture');

    const titleQuery = strapi.db.query('api::title.title');
    const titleService = strapi.service('api::title.title');

    const descriptionQuery = strapi.db.query('api::description.description');
    const descriptionService = strapi.service('api::description.description');

    const uploadPluginFileQuery = strapi.db.query('plugin::upload.file');
    const uploadPluginService = strapi.service('plugin::upload.upload');

    // delete(Many) on DB-Query-Layer in order to delete everything (empty object as param seems to work)
    // await titleQuery.deleteMany({});
    // await descriptionQuery.deleteMany({});
    // await keywordTagQuery.deleteMany({});
    // await categoryTagQuery.deleteMany({});
    // await pictureQuery.deleteMany({});
    // return 'Deletion successful';

    const data = fs.readFileSync(pathToAlbumData, 'utf-8');
    const albumData = JSON.parse(data);
    const data2 = fs.readFileSync(pathToTagInfoData, 'utf-8');
    const tagInfoData = JSON.parse(data2);

    const existingFilenames = fs.readdirSync('/home/dev/BP2021RH1/projects/bp-strapi/public/uploads/')
      .map(name => name.replace(/_/gm, '-'))
      .filter(filename => filename !== '.gitkeep' && filename !== '.gitignore'); // don't miss-interpret any git related stuff as real picture files

    const mediaIds = (await pictureQuery.findMany({
      populate: {
        media: {
          select: ['id']
        }
      }})).map(img => img.media.id);

    const pictureBuffer = {};
    for (const albumId of Object.keys(albumData)) {
      const album = albumData[albumId];
      const allFiles = [];
      for (const picId of Object.keys(album.pictures)) {
        const picture = album.pictures[picId];
        const path = `/home/dev/images/gallery/${album.dirname}/${picture.filename}`;
        if (fs.existsSync(path) && !existingFilenames.some(existingName =>
          existingName.substring(0, -15) === picture.filename.substring(0, -4)
        )) {
          const stats = fs.statSync(path);
          const file = {
            path,
            name: picture.filename,
            size: stats.size,
            type: 'image/jpeg'
          };
          allFiles.push(file);
          console.log('New image file found: ' + picture.filename);
        }
      }
      if (allFiles.length > 0) console.log('New image files in folder: ' + album.dirname);
      await uploadPluginService.upload({
        data: {
          fileInfo: {}
        },
        files: allFiles,
      });

      for (const picId of Object.keys(album.pictures)) {
        const picture = album.pictures[picId];
        const mediaRef = await uploadPluginFileQuery.findOne({
          where: {
            name: picture.filename,
          },
        });
        if (!mediaRef) {
          console.error('No media object found in db for: ' + picture.filename);
          continue;
        }
        // related means images that have been assigned this media file
        // If there already is such a picture, don't include it again
        if (mediaIds.includes(mediaRef.id)) {
          continue;
        }

        console.log('Including picture with wordpress_id: ', picId);
        let previousTitle = await titleQuery.findOne({
          where: {
            text: picture.alttext,
          },
        });

        if (!previousTitle) {
          previousTitle = await titleService.create({
            data: {
              text: picture.alttext,
            },
          });
        }
        let previousDescription = null;
        if (picture.description && picture.description !== '') {
          previousDescription = await descriptionQuery.findOne({
            where: {
              text: picture.description,
            },
          });
          if (!previousDescription) {
            previousDescription = await descriptionService.create({
              data: {
                text: picture.description,
              },
            });
          }
        }
        const keywordRefs = [];
        for (const keyword of picture.keywords) {
          let previousKeyword = await keywordTagQuery.findOne({
            where: {
              name: keyword,
            },
          });
          if (!previousKeyword) {
            previousKeyword = await keywordTagService.create({
              data: {
                name: keyword,
              },
            });
          }
          keywordRefs.push({id: previousKeyword.id});
        }

        pictureBuffer[picId] = await pictureService.create({
          data: {
            title: {
              id: previousTitle.id,
            },
            descriptions: (
              previousDescription ? [{
                id: previousDescription.id,
              }] : []
            ),
            media: {
              id: mediaRef.id,
            },
            keyword_tags: keywordRefs,
            wordpress_id: parseInt(picId),
          },
        });


        mediaIds.push(mediaRef.id);

      }
    }
    console.log('Picture upload finished');

    const parseTagJson = async (category, tagsSoFar) => {
      console.log('Parsing category tag', category.title);
      let tag = await categoryTagQuery.findOne({
        where: {
          name: category.title,
        },
      });
      if (!tag) {
        tag = await categoryTagService.create({
          data: {
            name: category.title,
            description: category.description,
            priority: category.priority,
          },
        });
      }
      tagsSoFar = tagsSoFar.concat([{id: tag.id}]);
      if (!isNaN(parseInt(category.albumId))) {
        const newAlbumId = Object
          .keys(albumData)
          .find(albumId => parseInt(albumId) === parseInt(category.albumId));
        const allPicturesInAlbum = albumData[newAlbumId].pictures;

        for (const picId of Object.keys(allPicturesInAlbum)) {
          await pictureQuery.update({
            where: {
              wordpress_id: parseInt(picId),
            },
            data: {
              category_tags: tagsSoFar,
            },
          });
        }
      }

      for (const child of category.children) {
        await parseTagJson(child, tagsSoFar);
      }
    };
    await parseTagJson(tagInfoData, []);

    return pictureBuffer;
  },

  async fillCategoryTags(pathToTagInfoData) {
    const data = fs.readFileSync(pathToTagInfoData, 'utf-8');
    const tagInfoData = JSON.parse(data);

    const categoryTagQuery = strapi.db.query('api::category-tag.category-tag');

    const relateTags = async (tag) => {
      const relatedTags = await Promise.all(tag.children.map(async child => {
        const categoryTag = await categoryTagQuery.findOne({
          where: {
            name: child.title,
          }
        });
        return categoryTag.id;
      }));
      console.log(tag.title, relatedTags);
      await categoryTagQuery.update({
        where: {
          name: tag.title,
        },
        data: {
          related_tags: relatedTags,
        },
      });
      for (const child of tag.children) {
        await relateTags(child);
      }
    };
    await relateTags(tagInfoData);
    return 'Relations between category tags successful created';
  },

  async importComments(pathToAlbumData) {
    const data = fs.readFileSync(pathToAlbumData, 'utf-8');
    const albumData = JSON.parse(data);

    const pictureQuery = strapi.db.query('api::picture.picture');
    const commentService = strapi.service('api::comment.comment');

    for (const album in albumData) {
      for (const picture in albumData[album].pictures) {
        for (const comment of albumData[album].pictures[picture]
          .comments) {
          const strapiPicture = await pictureQuery.findOne({
            where: {
              wordpress_id: picture,
            },
          });
          console.log(`Uploading comments for ${strapiPicture.id}`);
          await commentService.create({
            data: {
              text: comment.content,
              author: comment.author,
              date: comment.date,
              picture: strapiPicture.id,
            },
          });
        }
      }
    }
  },

  async importDraftComments(pathToDraftCommentData) {
    const data = fs.readFileSync(pathToDraftCommentData, 'utf-8');
    const draftComments = JSON.parse(data);

    const pictureQuery = strapi.db.query('api::picture.picture');
    const commentService = strapi.service('api::comment.comment');

    for (const idx in draftComments) {
      const comment = draftComments[idx];
      const strapiPicture = await pictureQuery.findOne({
        where: {
          wordpress_id: comment.picture.wordpress_id,
        },
      });
      console.log(`Uploading draft comment for ${strapiPicture.id}`);
      await commentService.create({
        data: {
          text: comment.text,
          author: comment.author,
          date: comment.date,
          picture: strapiPicture.id,
          publishedAt: null, // keep those as draft comments
        },
      });
    }
  },

  async addTimeRanges() {
    const matchAnyTime = (text) => {
      const yearRegex = /19[Xx0-9]{2}/gm;
      const yearSpanRegex = /19[Xx0-9]{2}[\s]*[–|\-|bis][\s]*19[Xx0-9]{2}/gm;
      const monthYearMatch = /(?:januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember)[\s]+19[Xx0-9]{2}/gmi;
      const wholeDateRegex = /([\s]+|^)[\d]{1,2}\.[\s]*(januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember|[\d]{1,2})(?:[\s]+|\.)19[Xx0-9]{2}/gmi;
      const exactMatch = text.match(wholeDateRegex) || [];
      const monthMatch = text.match(monthYearMatch) || [];
      const spanMatch = text.match(yearSpanRegex) || [];
      const yearMatch = text.replace(yearSpanRegex, '').match(yearRegex) || [];
      return exactMatch.concat(monthMatch).concat(spanMatch).concat(yearMatch);
    };

    const findTimes = (picture) => {
      let times = [];
      if (picture.descriptions) {
        picture.descriptions.forEach(description => {
          times = times.concat(matchAnyTime(description.text));
        });
      }
      if (picture.title) {
        times = times.concat(matchAnyTime(picture.title.text));
      }
      picture.category_tags.forEach((tag) => {
        if (tag.priority < 2) {return; }
        times = times.concat(matchAnyTime(tag.name));
        if (tag.description) {
          times = times.concat(matchAnyTime(tag.description));
        }
      });
      return times;
    };

    const pictureQuery = strapi.db.query('api::picture.picture');
    const timeRangeTagQuery = strapi.db.query('api::time-range-tag.time-range-tag');
    const timeRangeTagService = strapi.service('api::time-range-tag.time-range-tag');

    // delete(Many) on DB-Query-Layer in order to delete everything (empty object as param seems to work)
    // await timeRangeTagQuery.deleteMany({});
    // return 'Deletion successful';

    const allPictureData = await pictureQuery.findMany({
      offset: 0,
      limit: null, // workaround for `limit: -1`
      populate: ['category_tags', 'title', 'descriptions'],  // only relations information is needed from
    });
    const timeRangeBuffer = allPictureData.reduce((acc, picture) => {
      const times = findTimes(picture).filter(t => t);
      acc[picture.id] = parseTimes(times.filter((t, i) => times.indexOf(t) === i)).sort((a, b) => {
        return Math.abs(a[1] - a[0]) - Math.abs(b[1] - b[0]);
      });
      return acc;
    }, {});
    for (const picId of Object.keys(timeRangeBuffer)) {
      for (const timeRange of timeRangeBuffer[picId]) {
        const startDate = new Date(timeRange[0]);
        const endDate = new Date(timeRange[1]);
        let previousTag = await timeRangeTagQuery.findOne({
          where: {
            start: startDate,
            end: endDate,
          },
        });
        if (!previousTag) {
          previousTag = await timeRangeTagService.create({
            data: {
              start: startDate,
              end: endDate,
            },
          });
        }
      }
      if (timeRangeBuffer[picId].length > 0) {
        console.log(picId);
        const startDate = new Date(timeRangeBuffer[picId][0][0]);
        const endDate = new Date(timeRangeBuffer[picId][0][1]);
        const mostSpecificTag = await timeRangeTagQuery.findOne({
          where: {
            start: startDate,
            end: endDate,
          },
        });
        await pictureQuery.update({
          where: {
            id: picId,
          },
          data: {
            time_range_tag: {
              id: mostSpecificTag.id,
            },
          },
        });
      }
    }
    return timeRangeBuffer;
  },

  async importFromExcel(pathToExcelData) {
    const keywordTagQuery = strapi.db.query('api::keyword-tag.keyword-tag');
    const keywordTagService = strapi.service('api::keyword-tag.keyword-tag');

    const locationTagQuery = strapi.db.query('api::location-tag.location-tag');
    const locationTagService = strapi.service('api::location-tag.location-tag');

    const personTagQuery = strapi.db.query('api::person-tag.person-tag');
    const personTagService = strapi.service('api::person-tag.person-tag');

    const timeRangeTagQuery = strapi.db.query('api::time-range-tag.time-range-tag');
    const timeRangeTagService = strapi.service('api::time-range-tag.time-range-tag');

    const collectionQuery = strapi.db.query('api::collection.collection');
    const collectionService = strapi.service('api::collection.collection');

    const pictureQuery = strapi.db.query('api::picture.picture');
    const pictureService = strapi.service('api::picture.picture');

    const descriptionQuery = strapi.db.query('api::description.description');
    const descriptionService = strapi.service('api::description.description');

    const uploadPluginFileQuery = strapi.db.query('plugin::upload.file');
    const uploadPluginService = strapi.service('plugin::upload.upload');

    const workbook = XLSX.readFile(pathToExcelData);
    const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]).slice(1);

    const existingFilenames = fs.readdirSync('/home/dev/BP2021RH1/projects/bp-strapi/public/uploads/')
      .map(name => name.replace(/_/gm, '-'))
      .filter(filename => filename !== '.gitkeep' && filename !== '.gitignore'); // don't miss-interpret any git related stuff as real picture files


    const allFiles = [];
    for (const row of json) {
      // Upload image...
      const path = `/home/dev/images/excel/${row["Ordnername"]}/${row["Dateiname"]}`;
      if (fs.existsSync(path)) {
        const alreadyUploadedFile = existingFilenames.find(existingName =>
          existingName.slice(0, -15) === row["Dateiname"].slice(0, -4)
        );
        if (!alreadyUploadedFile) {
          const stats = fs.statSync(path);
          const file = {
            path,
            name: row["Dateiname"],
            size: stats.size,
            type: 'image/jpeg'
          };
          allFiles.push(file);
          strapi.log.info('New image file found: ' + row["Dateiname"]);
        } else {
          strapi.log.info(`File ${row["Dateiname"].slice(0, -4)} already exists as ${alreadyUploadedFile.slice(0, -15)}`);
        }
      } else {
        strapi.log.error(`File ${path} doesn't exist`);
      }
    }

    await uploadPluginService.upload({
      data: {
        fileInfo: {}
      },
      files: allFiles,
    });

    strapi.log.info('Upload finished');

    const splitTags = (rowdata) => rowdata.split(/,|;/gm).filter(r => r && !(r.match(/^\s*$/gm))).map(keyword => ({
      text: keyword.replace(/\(?\?+\)?/gm, '').replace(/[–|\-]/gm, '-').trim(),
      verified: !keyword.includes('?')
    }));

    const pictureBuffer = [];

    for (const row of json) {
      const categoryGroups = row["Kategorien"].split("|");
      for (const categoryGroup of categoryGroups) {
        const categories = splitTags(categoryGroup || '');
        categories.reverse();

        let parent = await collectionQuery.findOne({
          where: {
            name: 'Das Herbert-Ahrens-Bilderarchiv',
          },
        });
        let i = 0;
        for (const cat of categories) {
          let created = false;
          if (cat && cat.text) {
            let previousCollection = await collectionQuery.findOne({
              populate: ['parent_collections'],
              where: {
                name: cat.text,
              },
            });
            if (!previousCollection) {
              previousCollection = await collectionService.create({
                populate: ['parent_collections'],
                data: {
                  name: cat.text,
                },
              });
              created = true;
              strapi.log.info(`Created new collection "${cat.text}"`);
            }
            if (i !== 0 || created) {
              if (!previousCollection.parent_collections.some(p => p.id === parent.id)) {
                await collectionQuery.update({
                  where: {
                    id: previousCollection.id,
                  },
                  data: {
                    parent_collections: previousCollection.parent_collections.map(c => c.id).concat([parent.id])
                  },
                });
              }
            }
            i++;
            parent = previousCollection;
          }
        }
      }
    }

    strapi.log.info('All collections created!');

    let i = 1;

    const mediaIds = (await pictureQuery.findMany({
      populate: {
        media: {
          select: ['id']
        }
      }})).map(img => img.media.id);

    for (const row of json) {
      const mediaRef = await uploadPluginFileQuery.findOne({
        where: {
          name: row["Dateiname"],
        },
      });
      if (!mediaRef) {
        strapi.log.error('No media object found in db for: ' + row["Dateiname"]);
        continue;
      }
      // related means images that have been assigned this media file
      // If there already is such a picture, don't include it again

      if (mediaIds.includes(mediaRef.id)) {
        continue;
      }

      let previousDescription = null;
      let description = row["Beschreibung"] || '';

      if (row["Link"]) {
        description += `<br/><br/><a href="${row["Link"]}">${row["Link"]}</a>`;
      }

      if (description && description !== '') {
        previousDescription = await descriptionQuery.findOne({
          where: {
            text: description,
          },
        });
        if (!previousDescription) {
          previousDescription = await descriptionService.create({
            data: {
              text: description,
            },
          });
        }
      }

      const keywordRefs = [];
      const keywords = splitTags(row["Schlagwörter"] || '');

      for (const keyword of keywords) {
        let previousKeyword = await keywordTagQuery.findOne({
          where: {
            name: keyword.text,
          },
        });
        if (!previousKeyword) {
          previousKeyword = await keywordTagService.create({
            data: {
              name: keyword.text,
            },
          });
        }
        keywordRefs.push({id: previousKeyword.id, verified: keyword.verified});
      }

      const locationRefs = [];
      const locations = splitTags(row["Orte"] || '');

      for (const location of locations) {
        let previousLocation = await locationTagQuery.findOne({
          where: {
            name: location.text,
          },
        });
        if (!previousLocation) {
          previousLocation = await locationTagService.create({
            data: {
              name: location.text,
            },
          });
        }
        locationRefs.push({id: previousLocation.id, verified: location.verified});
      }

      const personRefs = [];
      const people = splitTags(row["Personen"] || '');

      for (const person of people) {
        let previousPerson = await personTagQuery.findOne({
          where: {
            name: person.text,
          },
        });
        if (!previousPerson) {
          previousPerson = await personTagService.create({
            data: {
              name: person.text,
            },
          });
        }
        personRefs.push({id: previousPerson.id, verified: person.verified});
      }

      let timeRef = null;
      const timeRange = (row["Datum/Zeiträume"] && row["Datum/Zeiträume"] !== '') ? parseTimes([row["Datum/Zeiträume"]]) : null;

      if (timeRange && timeRange.length) {
        let previousTimeRangeTag = await timeRangeTagQuery.findOne({
          where: {
            start: timeRange[0][0],
            end: timeRange[0][1]
          },
        });
        if (!previousTimeRangeTag) {
          previousTimeRangeTag = await timeRangeTagService.create({
            data: {
              start: timeRange[0][0],
              end: timeRange[0][1]
            },
          });
        }
        timeRef = {id: previousTimeRangeTag.id, verified: true};
      }

      // Categories
      const previousCollections = [];
      const categoryGroups = row["Kategorien"].split('|');
      for (const categoryGroup of categoryGroups) {
        let previousCollection = await collectionQuery.findOne({
          where: {
            name: splitTags(categoryGroup)[0].text
          },
        });
        previousCollections.push(previousCollection);
      }

      const picdata = {
        data: {
          descriptions: (
            previousDescription ? [{
              id: previousDescription.id,
            }] : []
          ),
          media: {
            id: mediaRef.id,
          },
          keyword_tags: keywordRefs.filter(key => !key.verified).map(key => key.id),
          verified_keyword_tags: keywordRefs.filter(key => key.verified).map(key => key.id),
          location_tags: locationRefs.filter(key => !key.verified).map(key => key.id),
          verified_location_tags: locationRefs.filter(key => key.verified).map(key => key.id),
          person_tags: personRefs.filter(key => !key.verified).map(key => key.id),
          verified_person_tags: personRefs.filter(key => key.verified).map(key => key.id),
          archive_identifier: row["Archiv-Kennung"] || row["Ordner"] || null,
          collections: previousCollections.map(collection => collection.id)
        },
      }

      if (timeRef) {
        if (timeRef.verified) {
          picdata.data['verified_time_range_tag'] =  timeRef.id;
        } else {
          picdata.data['time_range_tag'] =  timeRef.id;
        }
      }

      const newlyCreatedPicture = await pictureService.create(picdata);
      pictureBuffer.push(newlyCreatedPicture);
      mediaIds.push(mediaRef.id);

      strapi.log.info(`[${i++}/${json.length}] Created picture ${row["Dateiname"]} -> id: ${newlyCreatedPicture.id}`);

    }

    strapi.log.info('Import finished!');

    return pictureBuffer;
  },

  async reducePictureCollectionRelations() {

    const pictureQuery = strapi.db.query('api::picture.picture');

    const pictures = await pictureQuery.findMany({
      select: ['id'],
      populate: {
        collections: {
          select: ['id'],
          populate: {
            parent_collections: {
              select: ['id']
            }
          }
        }
      }
    });

    let responsebuffer = [];

    for (const picture of pictures) {
      const parents = picture.collections.reduce((acc, collection) => {
        return acc.concat(collection.parent_collections.map(p => p.id));
      }, []);

      const mostSpecificCollections = picture.collections.filter(collection => !parents.includes(collection.id));

      strapi.log.info(`Reduced collections for picture ${picture.id} to [${mostSpecificCollections.map(c => c.id).join(',')}]`);
      await pictureQuery.update({
        where: {
          id: picture.id
        },
        data: {
          collections: mostSpecificCollections.map(collection => collection.id)
        }
      });

      responsebuffer.push({picture, mostSpecificCollections});
    }

    return responsebuffer;
  },

  async addDefaultArchiveTag() {
    const pictureQuery = strapi.db.query('api::picture.picture');
    const archiveTagQuery = strapi.db.query('api::archive-tag.archive-tag');
    const defaultArchiveTagName = 'Herbert-Ahrens-Bilderarchiv';

    const defaultArchiveTag = await archiveTagQuery.findOne({
      where: {
        name: defaultArchiveTagName,
      },
    });

    if (!defaultArchiveTag) {
      const errorMessage = `There is no archive tag called "${defaultArchiveTagName}"`;
      strapi.log.error(errorMessage);
      return errorMessage;
    }

    const allPictures = await pictureQuery.findMany({
      populate: {
        archive_tag: {
          select: ['id'],
        },
      },
    });

    const updatedPictures = [];
    for (const picture of allPictures) {
      if (picture.archive_tag) continue;

      await pictureQuery.update({
        where: {
          id: picture.id,
        },
        data: {
          archive_tag: defaultArchiveTag.id,
        },
      });
      updatedPictures.push(picture.id);
    }

    const responseMessage = updatedPictures.length ?
      `Successfully related ${updatedPictures.length} pictures to default archive tag "${defaultArchiveTag}"`
      : `Related no new pictures to the default archive tag "${defaultArchiveTagName}"`;
    strapi.log.debug(responseMessage);
    return updatedPictures;
  },
});
