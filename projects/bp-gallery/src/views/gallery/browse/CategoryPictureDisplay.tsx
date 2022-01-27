import React from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../../../components/Loading';
import QueryErrorDisplay from '../../../components/QueryErrorDisplay';
import PictureScrollGrid from '../common/PictureScrollGrid';
import SubCategories from './SubCategories';
import CategoryDescription from './CategoryDescription';
import { PictureFiltersInput } from '../../../graphql/APIConnector';

const getPictureFilters = (categoryId: string, picturePublishingDate?: string) => {
  const filters: PictureFiltersInput = { and: [] };

  filters.and?.push({
    category_tags: {
      id: {
        eq: categoryId,
      },
    },
  });

  if (picturePublishingDate) {
    filters.and?.push({
      publishedAt: {
        gt: picturePublishingDate,
      },
    });
  }

  return filters;
};

const CategoryPictureDisplay = ({
  error,
  loading = false,
  categoryTags,
  path,
  scrollPos,
  scrollHeight,
  picturePublishingDate,
}: {
  error?: any;
  loading?: boolean;
  categoryTags?: any;
  path: string[] | undefined;
  scrollPos: number;
  scrollHeight: number;
  picturePublishingDate?: string;
}) => {
  const { t } = useTranslation();

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (categoryTags?.length && categoryTags[0]) {
    const category = categoryTags[0];
    const relatedTagsSize = category.related_tags?.length ?? 0;

    return (
      <div className='browse-view'>
        <CategoryDescription description={category.description ?? ''} name={category.name} />
        {relatedTagsSize > 0 && (
          <SubCategories
            relatedTags={category.related_tags as { thumbnail: any[]; name: string }[]}
            path={path}
            communityView={!!picturePublishingDate}
          />
        )}
        <PictureScrollGrid
          filters={getPictureFilters(category.id as string, picturePublishingDate)}
          scrollPos={scrollPos}
          scrollHeight={scrollHeight}
          hashbase={category.name}
        />
      </div>
    );
  } else {
    return <div>{t('common.no-category')}</div>;
  }
};

export default CategoryPictureDisplay;
