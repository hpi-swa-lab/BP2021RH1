import React from 'react';
import { PictureFiltersInput, useGetMultiplePictureInfoQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import {
  FlatCollectionWithoutRelations,
  FlatKeywordTag,
  FlatLocationTagWithoutRelations,
  FlatPersonTagWithoutRelations,
  FlatPicture,
} from '../../../types/additionalFlatTypes';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import ScrollContainer from '../../common/ScrollContainer';
import PictureSidebar from './sidebar/PictureSidebar';
import './BulkEditView.scss';

export type BulkEditProps = {
  queryParams: PictureFiltersInput;
  pictureIds?: string[];
};

const BulkEditView = ({ queryParams, pictureIds }: BulkEditProps) => {
  const { data, loading, error } = useGetMultiplePictureInfoQuery({ variables: { pictureIds } });
  const pictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(data)?.pictures;

  console.log(pictures);
  const fakePicture: FlatPicture = {
    id: '',
    keyword_tags: [],
    person_tags: [],
    location_tags: [],
    collections: [],
  };

  type Tag =
    | FlatLocationTagWithoutRelations
    | FlatPersonTagWithoutRelations
    | FlatKeywordTag
    | FlatCollectionWithoutRelations;

  const makeSet = (pictureKeywords: Tag[] | undefined, fakeKeywords: Tag[] | undefined) => {
    pictureKeywords?.map(tag => {
      if (!fakeKeywords?.map(tag2 => tag2.id).includes(tag.id)) fakeKeywords?.push(tag);
    });
  };

  pictures?.map(picture => {
    fakePicture.id = fakePicture.id ? `${fakePicture.id},${picture.id}` : picture.id;
    makeSet(picture.location_tags, fakePicture.location_tags);
    makeSet(picture.keyword_tags, fakePicture.keyword_tags);
    makeSet(picture.person_tags, fakePicture.person_tags);
    makeSet(picture.collections, fakePicture.collections);
  });

  console.log(fakePicture);

  return (
    <div className='multi-view-container'>
      <ScrollContainer>
        {(scrollPos: number, scrollHeight: number) => (
          <div className='collection-picture-display'>
            <PictureScrollGrid
              queryParams={queryParams}
              hashbase='lol'
              scrollPos={scrollPos}
              scrollHeight={scrollHeight}
              viewOnly={true}
            />
          </div>
        )}
      </ScrollContainer>
      <PictureSidebar picture={fakePicture} loading={loading} error={error} isMulti={true} />
    </div>
  );
};

export default BulkEditView;
