import { useTranslation } from 'react-i18next';
import Loading from '../../../components/Loading';
import QueryErrorDisplay from '../../../components/QueryErrorDisplay';
import PictureScrollGrid from '../common/PictureScrollGrid';
import SubCategories from './SubCategories';
import React from 'react';

const CategoryPictureDisplay = ({
  result,
  categoryTags,
  path,
  scrollPos,
  scrollHeight,
  communityView,
  multi_picture_mode = true,
}: {
  result: any;
  categoryTags: any;
  path: string[] | undefined;
  scrollPos: number;
  scrollHeight: number;
  communityView: boolean;
  multi_picture_mode: boolean;
}) => {
  const { t } = useTranslation();
  if (result.error) {
    return <QueryErrorDisplay error={result.error} />;
  } else if (result.loading) {
    return <Loading />;
  } else if (categoryTags.length && categoryTags[0]) {
    const category = categoryTags[0];
    let relatedTagsSize = category.related_tags?.length ?? 0;
    let relatedTags = category.related_tags;
    if (communityView) {
      relatedTagsSize = 0;
      if (multi_picture_mode) {
        relatedTagsSize = 1;
      }
      relatedTags = categoryTags;
    }
    return (
      <div className='browse-view'>
        {relatedTagsSize > 0 && (
          <SubCategories
            relatedTags={relatedTags as { thumbnail: any[]; name: string }[]}
            path={path}
            communityView={communityView}
          />
        )}
        <PictureScrollGrid
          where={{ category_tags: category.id }}
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
