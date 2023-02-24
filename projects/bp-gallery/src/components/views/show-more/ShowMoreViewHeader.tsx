import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatTag, TagType, Thumbnail } from '../../../types/additionalFlatTypes';
import TagOverview from '../../common/TagOverview';
import CollectionDescription from '../browse/CollectionDescription';
import { getCategoryQueryParams } from './helpers/queryParams-helpers';

const ShowMoreViewHeader = ({
  archiveId,
  categoryType,
  categoryId,
  collectionsInfo,
  flattenedTags,
}: {
  archiveId: string | undefined;
  categoryType: string;
  categoryId?: string;
  collectionsInfo:
    | {
        [key: string]: any;
      }
    | undefined;
  flattenedTags: (FlatTag & { thumbnail: Thumbnail[] })[] | undefined;
}) => {
  const { t } = useTranslation();

  const getShowMoreHeader = () => t(`show-more.${categoryType}-title`);
  const getShowMoreText = () => t(`show-more.${categoryType}-text`);

  if (categoryType === 'pictures') {
    if (categoryId && collectionsInfo && collectionsInfo.collections.length > 0) {
      return (
        <CollectionDescription
          id={collectionsInfo.collections[0].id}
          description={collectionsInfo.collections[0].description ?? ''}
          name={collectionsInfo.collections[0].name}
        />
      );
    } else {
      return (
        <div>
          <h2>{getShowMoreHeader()}</h2>
          <div className='show-more-description'>{getShowMoreText()}</div>
        </div>
      );
    }
  } else if (categoryId) {
    return (
      <div>
        {flattenedTags && (categoryType === 'date' || flattenedTags.length > 0) && (
          <h2>
            {categoryType === 'date'
              ? categoryId === '4'
                ? t('common.past')
                : t('show-more.x0s', { decade: categoryId })
              : flattenedTags[0].name}
          </h2>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <h2>{getShowMoreHeader()}</h2>
        <div className='show-more-description'>{getShowMoreText()}</div>
        <TagOverview
          type={categoryType as TagType}
          queryParams={getCategoryQueryParams(archiveId)}
          archiveId={archiveId}
        />
      </div>
    );
  }
};

export default ShowMoreViewHeader;
