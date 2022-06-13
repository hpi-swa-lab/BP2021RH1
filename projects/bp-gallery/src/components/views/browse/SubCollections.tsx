import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { asApiPath } from '../../App';
import React from 'react';
import { decodeBrowsePathComponent, formatBrowsePath } from './helpers/format-browse-path';
import ItemList from '../../common/ItemList';
import { FlatCollectionWithoutRelations } from '../../../types/additionalFlatTypes';

const SubCollections = ({
  childCollections,
  path,
  onlyLatest,
}: {
  childCollections: FlatCollectionWithoutRelations[];
  path?: string[];
  onlyLatest?: boolean;
}) => {
  const DEFAULT_THUMBNAIL_URL = '/bad-harzburg-stiftung-logo.png';
  const history: History = useHistory();
  const buildItem = (collection: FlatCollectionWithoutRelations, index: number) => {
    return {
      name: decodeBrowsePathComponent(collection.name),
      background: collection.thumbnail ? asApiPath(collection.thumbnail) : DEFAULT_THUMBNAIL_URL,
      color: index % 2 === 0 ? '#7E241D' : '#404272',
      onClick: () => {
        history.push(formatBrowsePath(path, onlyLatest, collection.name), { showBack: true });
      },
    };
  };
  const items = childCollections.map((collection, i) => buildItem(collection, i));
  return <ItemList items={items} />;
};

export default SubCollections;
