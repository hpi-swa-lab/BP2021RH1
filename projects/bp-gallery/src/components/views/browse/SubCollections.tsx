import { useTranslation } from 'react-i18next';
import { asApiPath } from '../../../helpers/app-helpers';
import { FlatCollectionWithoutRelations } from '../../../types/additionalFlatTypes';
import ItemList from '../../common/ItemList';
import { ItemListItemModel } from '../../common/ItemListItem';
import { useVisit } from './../../../helpers/history';
import { decodeBrowsePathComponent, formatBrowsePath } from './helpers/format-browse-path';

const SubCollections = ({
  childCollections,
  path,
}: {
  childCollections: FlatCollectionWithoutRelations[];
  path?: string[];
}) => {
  const DEFAULT_THUMBNAIL_URL = '/bad-harzburg-stiftung-logo.png';
  const { visit } = useVisit();
  const { t } = useTranslation();

  const buildItem = (collection: FlatCollectionWithoutRelations, index: number) => {
    let color = index % 2 === 0 ? '#7E241D' : '#404272';
    if (!collection.publishedAt) {
      color = '#EEEEEE';
    }
    return {
      name: decodeBrowsePathComponent(collection.name),
      // TODO Actually fixing the backend method for generating collection thumbnails
      background: collection.thumbnail
        ? !collection.thumbnail.includes('http')
          ? asApiPath(collection.thumbnail)
          : collection.thumbnail
        : DEFAULT_THUMBNAIL_URL,
      color,
      onClick: () => {
        visit(formatBrowsePath(path, collection.name));
      },
    };
  };
  const items: ItemListItemModel[] = [];

  if (!path) {
    items.push({
      name: t('common.latest-pictures'),
      background: DEFAULT_THUMBNAIL_URL,
      color: '#404272',
      onClick: () => {
        visit('/latest');
      },
    });
  }

  childCollections.forEach((collection, i) => items.push(buildItem(collection, i)));

  return <ItemList items={items} />;
};

export default SubCollections;
