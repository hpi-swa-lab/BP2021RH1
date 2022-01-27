import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { asApiPath } from '../../../App';
import ItemList from '../common/ItemList';
import React from 'react';
import { decodeBrowsePathComponent, formatBrowsePath } from './helpers/formatBrowsePath';

const SubCategories = ({
  relatedTags,
  path,
  communityView,
}: {
  relatedTags: { thumbnail: any[]; name: string }[];
  path?: string[];
  communityView?: boolean;
}) => {
  const history: History = useHistory();
  const buildItem = (category: { thumbnail: any[]; name: string }, index: number) => {
    const formats = category.thumbnail[0].media?.formats;
    return {
      name: decodeBrowsePathComponent(category.name),
      background: asApiPath(
        String(formats?.medium?.url || formats?.small?.url || formats?.thumbnail?.url || '')
      ),
      color: index % 2 === 0 ? '#7E241D' : '#404272',
      onClick: () => {
        history.push(formatBrowsePath(path, communityView, category.name), { showBack: true });
      },
    };
  };
  const items = relatedTags.map((tag, i) => buildItem(tag, i));
  return <ItemList items={items} />;
};

export default SubCategories;
