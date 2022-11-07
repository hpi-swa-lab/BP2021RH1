import { Button, Icon } from '@mui/material';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetAllLocationTagsLazyQuery,
  useGetMultiplePictureInfoQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import {
  FlatCollectionWithoutRelations,
  FlatKeywordTag,
  FlatLocationTagWithoutRelations,
  FlatPersonTagWithoutRelations,
  FlatPicture,
} from '../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import './BulkOperationsPanel.scss';

export interface BulkOperation {
  icon: string;
  name: string;
  action: (selectedPictures: FlatPicture[]) => void;
}

const BulkOperationsPanel = ({
  operations,
  selectedPictures,
}: {
  operations: BulkOperation[];
  selectedPictures: FlatPicture[];
}) => {
  const { t } = useTranslation();
  const { role } = useAuth();
  const [getAllLocations, locationsResponse] = useGetAllLocationTagsLazyQuery();
  const pictureIds = selectedPictures.map(picture => picture.id);

  const { data, loading, error } = useGetMultiplePictureInfoQuery({ variables: { pictureIds } });
  const pictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(data)?.pictures;

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

  useMemo(() => {
    if (role >= AuthRole.CURATOR) {
      getAllLocations();
    }
  }, [role, getAllLocations]);

  const allLocations = useSimplifiedQueryResponseData(locationsResponse.data)?.locationTags;

  return (
    <div className='bulk-operations'>
      {operations.map((operation, index) => (
        <Button
          key={index}
          onClick={() => operation.action(selectedPictures)}
          className='operation'
          startIcon={<Icon>{operation.icon}</Icon>}
          variant='contained'
        >
          {operation.name}
        </Button>
      ))}
    </div>
  );
};

export default BulkOperationsPanel;
