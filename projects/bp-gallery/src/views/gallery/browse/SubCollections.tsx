import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { asApiPath } from '../../../App';
import ItemList from '../common/ItemList';
import React from 'react';
import { decodeBrowsePathComponent, formatBrowsePath } from './helpers/formatBrowsePath';

const SubCollections = ({
  childCollections,
  path,
  communityView,
}: {
  childCollections: { thumbnail: any[]; name: string }[];
  path?: string[];
  communityView?: boolean;
}) => {
  const history: History = useHistory();
  const buildItem = (collection: { thumbnail: any[]; name: string }, index: number) => {
    const formats = collection.thumbnail[0].media?.formats;
    return {
      name: decodeBrowsePathComponent(collection.name),
      background: asApiPath(
        String(formats?.medium?.url || formats?.small?.url || formats?.thumbnail?.url || '')
      ),
      color: index % 2 === 0 ? '#7E241D' : '#404272',
      onClick: () => {
        history.push(formatBrowsePath(path, communityView, collection.name), { showBack: true });
      },
    };
  };
  const items = childCollections.map((collection, i) => buildItem(collection, i));
  return <ItemList items={items} />;
};

export default SubCollections;
