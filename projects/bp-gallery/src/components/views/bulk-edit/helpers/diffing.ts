import { differenceWith, intersectionWith, isEqual } from 'lodash';
import { FlatPicture } from '../../../../types/additionalFlatTypes';
import { Field } from '../../picture/sidebar/picture-info/PictureInfo';

export const combineToSingle = <T>(
  pictures: FlatPicture[],
  selector: (picture: FlatPicture) => T
): T | undefined => {
  const properties = pictures.map(selector);
  if (properties.length === 0) {
    return undefined;
  }
  if (properties.every(property => isEqual(property, properties[0]))) {
    return properties[0];
  } else {
    return undefined;
  }
};

export const combineToIntersection = <T>(
  pictures: FlatPicture[],
  selector: (picture: FlatPicture) => T[] | undefined
): T[] => {
  const properties = pictures.map(selector).filter(array => array !== undefined);
  return intersectionWith(...properties, isEqual);
};

export const combinePictures = (pictures: FlatPicture[]): FlatPicture => {
  return {
    id: pictures.map(picture => picture.id).join(','),
    archive_tag: combineToSingle(pictures, picture => picture.archive_tag),
    collections: combineToIntersection(pictures, picture => picture.collections),
    comments: combineToIntersection(pictures, picture => picture.comments),
    descriptions: combineToIntersection(pictures, picture => picture.descriptions),
    keyword_tags: combineToIntersection(pictures, picture => picture.keyword_tags),
    location_tags: combineToIntersection(pictures, picture => picture.location_tags),
    person_tags: combineToIntersection(pictures, picture => picture.person_tags),
    time_range_tag: combineToSingle(pictures, picture => picture.time_range_tag),
  };
};

export type PictureDiff = {
  [K in keyof FlatPicture]?: FlatPicture[K] extends (infer T)[] | undefined
    ? {
        added: T[];
        removed: T[];
      }
    : FlatPicture[K];
};

export const computePictureDiff = (oldPicture: Field, newPicture: Field): PictureDiff => {
  // entries => fromEntries instead of literal object notation like in combinePictures
  // to only keep keys that are on newPicture
  return Object.fromEntries(
    Object.entries(newPicture).map(([key, newValues]) => {
      if (!(newValues instanceof Array)) {
        // just plainly overwrite values which aren't arrays
        return [key, newValues];
      }
      type Element = typeof newValues[number];
      const oldValues = oldPicture[key as keyof Field] as Field[keyof Field] & Array<any>;
      const diff = {
        added: differenceWith<Element, Element>(newValues, oldValues, isEqual),
        removed: differenceWith<Element, Element>(oldValues, newValues, isEqual),
      };
      return [key, diff];
    })
  );
};
