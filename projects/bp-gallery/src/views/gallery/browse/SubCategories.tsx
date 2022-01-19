import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { asApiPath } from '../../../App';
import ItemList from '../common/ItemList';
import React from 'react';
import { decodeBrowsePathComponent, encodeBrowsePathComponent } from './BrowseView';

const SubCategories = ({
  relatedTags,
  path,
}: {
  relatedTags: { thumbnail: any[]; name: string }[];
  path?: string[];
}) => {
  const history: History = useHistory();
  const formatCategoryPath = (name: string) => {
    return `/browse/${
      path
        ?.map(folder => {
          return encodeBrowsePathComponent(folder);
        })
        .join('/') ?? ''
    }/${encodeBrowsePathComponent(name)}`.replace(/\/+/gm, '/');
  };
  const buildItem = (category: { thumbnail: any[]; name: string }, index: number) => {
    const formats = category.thumbnail[0].media.formats;
    return {
      name: decodeBrowsePathComponent(category.name),
      background: asApiPath(
        String(formats?.medium?.url || formats?.small?.url || formats?.thumbnail?.url || '')
      ),
      color: index % 2 === 0 ? '#7E241D' : '#404272',
      onClick: () => {
        history.push(formatCategoryPath(category.name), { showBack: true });
      },
    };
  };
  const items = relatedTags.map((tag, i) => buildItem(tag, i));
  return (
    <div>
      <ItemList items={items} />
    </div>
  );
};

export default SubCategories;
