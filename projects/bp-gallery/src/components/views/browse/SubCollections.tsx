import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { asApiPath } from '../../App';
import React from 'react';
import { decodeBrowsePathComponent, formatBrowsePath } from './helpers/format-browse-path';
import ItemList from '../../common/ItemList';
import { FlatCollectionWithoutRelations } from '../../../types/additionalFlatTypes';
import { ItemListItemModel } from '../../common/ItemListItem';

const SubCollections = ({
  childCollections,
  path,
}: {
  childCollections: FlatCollectionWithoutRelations[];
  path?: string[];
}) => {
  const DEFAULT_THUMBNAIL_URL = '/bad-harzburg-stiftung-logo.png';
  const history: History = useHistory();
  const buildItem = (collection: FlatCollectionWithoutRelations, index: number) => {
    let color = index % 2 === 0 ? '#7E241D' : '#404272';
    if (!collection.publishedAt) {
      color = '#EEEEEE';
    }
    return {
      name: decodeBrowsePathComponent(collection.name),
      background: collection.thumbnail ? asApiPath(collection.thumbnail) : DEFAULT_THUMBNAIL_URL,
      color,
      onClick: () => {
        history.push(formatBrowsePath(path, collection.name), { showBack: true });
      },
    };
  };
  const items: ItemListItemModel[] = [];

  if (!path) {
    items.push({
      name: 'Neue Bilder der Woche',
      background: DEFAULT_THUMBNAIL_URL,
      color: '#404272',
      onClick: () => {
        history.push('/latest', { showBack: true });
      },
    });
  }

  childCollections.forEach((collection, i) => items.push(buildItem(collection, i)));

  return <ItemList items={items} />;
};

export default SubCollections;
