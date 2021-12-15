'use strict';

/**
 * bulk-import.js controller
 *
 * @description: A set of functions called "actions" of the `bulk-import` plugin.
 */

module.exports = {

  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // Add your own logic here.

    // Send 200 `ok`
    ctx.send({
      message: 'ok'
    });
  },
  import: async (ctx) => {
    // // strapi.services['keyword-tag'].delete({id: 1});
    // await strapi.connections.default.raw('DELETE FROM `titles_pictures__pictures_titles`');
    // ctx.send('ok');
    // return;
    // await strapi.services.title.delete();
    // await strapi.services.description.delete();
    // await strapi.services['keyword-tag'].delete();
    // await strapi.services['category-tag'].delete();
    // await strapi.services['time-range-tag'].delete();
    // await strapi.services.picture.delete();
    // ctx.send('ok');
    // return;
    const fs = require('fs');
    const data = fs.readFileSync(ctx.request.files['jsondata'].path, 'utf-8');
    const albumData = JSON.parse(data);
    const data2 = fs.readFileSync(ctx.request.files['jsondata2'].path, 'utf-8');
    const tagInfoData = JSON.parse(data2);

    const existingNames = fs.readdirSync('/home/dev/BP2021RH1/projects/bp-strapi/public/uploads/').map(name => name.replace(/_/gm, '-'));

    const buffer = {};
    for (const albumid of Object.keys(albumData)) {
      const album = albumData[albumid];
      const allFiles = [];
      for (const picid of Object.keys(album.pictures)) {
        // strapi.services['keyword-tag'].delete({'name': 'Bad Harzburg'});
        const picture = album.pictures[picid];
        const path = `/home/dev/images/gallery/${album.dirname}/${picture.filename}`;
        if (fs.existsSync(path) && !existingNames.some(exName => 
          exName.substring(0, -15) === picture.filename.substring(0, -4)
        )) {
          const stats = fs.statSync(path);
          const file = {
            path,
            name: picture.filename,
            size: stats.size,
            type: 'image/jpeg'
          };
          allFiles.push(file);
          console.log('New image found:' + picture.filename);
        }
      }
      if (allFiles.length > 0) console.log('New images in folder:' + album.dirname)
      await strapi.plugins['upload'].services.upload.upload({data: {
        fileInfo: {}
      }, files: allFiles});
      
      for (const picid of Object.keys(album.pictures)) {
        const picture = album.pictures[picid];
        const mediaRef = await strapi.plugins['upload'].services.upload.fetch({
          "name": picture.filename
        });
        if (!mediaRef) {
          console.error(picture.filename);
          continue;
        }
        // related means images that have been assigned this media file
        // If there already is such a picture, don't include it again
        if (mediaRef.related && mediaRef.related.length) {
          continue;
        }
        console.log('Including image', picid);
        let previousTitle = await strapi.services.title.findOne({text: picture.alttext});

        if (!previousTitle) {
          previousTitle = await strapi.services.title.create({
            text: picture.alttext
          });
        }
        let previousDescription = null;
        if (picture.description && picture.description !== '') {
          previousDescription = await strapi.services.description.findOne({text: picture.description});
          if (!previousDescription) {
            previousDescription = await strapi.services.description.create({
              text: picture.description
            });
          }
        }
        const keywordRefs = [];
        for (const keyword of picture.keywords) {
          let previousKeyword = await strapi.services['keyword-tag'].findOne({name: keyword});
          if (!previousKeyword) {
            previousKeyword = await strapi.services['keyword-tag'].create({
              name: keyword
            });
          }
          keywordRefs.push({
            id: previousKeyword.id
          });
        }
        const commentRefs = picture.comments.map(comment => {
          return {
            text: comment.content,
            author: comment.author,
            date: comment.date
          }
        });
        buffer[picid] = await strapi.services.picture.create({
          title: {id: previousTitle.id},
          descriptions: (previousDescription ? [{id: previousDescription.id}] : []),
          media: {id: mediaRef.id},
          keyword_tags: keywordRefs,
          Comment: commentRefs,           // Is a Component, hence Caps
          wordpress_id: parseInt(picid),
        });

      }
    }
    console.log('Upload finished');

    const parseTagJson = async (cat, tagsSoFar) => {
      console.log('Parsing category tag', cat.title);
      let tag = await strapi.services['category-tag'].findOne({name: cat.title});
      if (!tag) {
        tag = await strapi.services['category-tag'].create({
          name: cat.title,
          description: cat.description,
          priority: cat.priority
        });
      }
      tagsSoFar = tagsSoFar.concat([{id: tag.id}]);
      if (!isNaN(parseInt(cat.albumId))) {
        const newAlbumId = Object
        .keys(albumData)
        .find(albumid => parseInt(albumid) === parseInt(cat.albumId));
        const allPicturesInAlbum = albumData[newAlbumId].pictures;

        for (const picid of Object.keys(allPicturesInAlbum)) {
          await strapi.services.picture.update({wordpress_id: parseInt(picid)}, {
            category_tags: tagsSoFar
          });
        }
      }

      for (const child of cat.children) {
        await parseTagJson(child, tagsSoFar);
      }
    };
    await parseTagJson(tagInfoData, []);

    ctx.send(buffer);
  },
  addTimeRanges: async (ctx) => {
    const matchAnyTime = (text) => {
      const yearRegex = /19[Xx0-9]{2}/gm;
      const yearSpanRegex = /19[Xx0-9]{2}[\s]*[–|-|bis][\s]*19[Xx0-9]{2}/gm;
      const monthYearMatch = /(?:januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember)[\s]+19[Xx0-9]{2}/gmi;
      const wholeDateRegex = /([\s]+|^)[\d]{1,2}\.[\s]*(januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember|[\d]{1,2})(?:[\s]+|\.)19[Xx0-9]{2}/gmi;
      const exactMatch = text.match(wholeDateRegex) || [];
      const monthMatch = text.match(monthYearMatch) || [];
      const spanMatch = text.match(yearSpanRegex) || [];
      const yearMatch = text.replace(yearSpanRegex, '').match(yearRegex) || [];
      return exactMatch.concat(monthMatch).concat(spanMatch).concat(yearMatch);
    }

    const parseTimes = (arr) => {
      const months = ["januar", "februar", "märz", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "dezember"];
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
        } else if (parts[0].match(/[–|-|bis]/gm)) {
          let [start, end] = parts[0].split(/[\s]*[–|-|bis][\s]*/gm);
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
    }

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

    const times = (await strapi.services.picture.find({_limit: -1})).reduce((acc, picture) => {
      const times = findTimes(picture).filter(t => t);
      acc[picture.id] = parseTimes(times.filter((t, i) => times.indexOf(t) === i)).sort((a, b) => {
        return Math.abs(a[1] - a[0]) - Math.abs(b[1] - b[0]);
      });
      return acc;
    }, {});
    for (const picid of Object.keys(times)) {
      for (const timerange of times[picid]) {
        const startDate = new Date(timerange[0]);
        const endDate = new Date(timerange[1]);
        let previousTag = await strapi.services['time-range-tag'].findOne({start: startDate, end: endDate});
        if (!previousTag) {
          previousTag = await strapi.services['time-range-tag'].create({
            start: startDate,
            end: endDate
          });
        }
      }
      if (times[picid].length > 0) {
        console.log(picid);
        const startDate = new Date(times[picid][0][0]);
        const endDate = new Date(times[picid][0][1]);
        const mostSpecificTag = await strapi.services['time-range-tag'].findOne({start: startDate, end: endDate});
        await strapi.services.picture.update({id: picid}, {
          time_range_tag: {id: mostSpecificTag.id}
        });
      }
    }
    ctx.send(times);
  },
  fillCategoryTags: async (ctx) => {
    const fs = require('fs');
    const data = fs.readFileSync(ctx.request.files['jsondata'].path, 'utf-8');
    const tagInfoData = JSON.parse(data);

    const relateTags = async (tag) => {
      const relatedTags = await Promise.all(tag.children.map(async child => {
        return (await strapi.services['category-tag'].findOne({name: child.title})).id;
      }));
      console.log(tag.title, relatedTags)
      await strapi.services['category-tag'].update({name: tag.title}, {
        related_tags: relatedTags
      });
      for (const child of tag.children) {
        relateTags(child);
      }
    }

    await relateTags(tagInfoData);
    return {'success': true};
  },

  convertComments: async (ctx) => {
    const fs = require("fs");
    const data = fs.readFileSync(ctx.request.files["jsondata"].path, "utf-8");
    const pictureInfoData = JSON.parse(data);

    for (const album in pictureInfoData) {
      for (const picture in pictureInfoData[album].pictures) {
        for (const comment of pictureInfoData[album].pictures[picture]
          .comments) {
          const strapiPicture = await strapi.services["picture"].findOne({
            wordpress_id: picture,
          });
          console.log(`uplpoading comments for ${strapiPicture.id}`)
          await strapi.services["comment"].create({
            text: comment.content,
            author: comment.author,
            date: comment.date,
            picture: strapiPicture.id,
          });
        }
      }
    }
  }
};
