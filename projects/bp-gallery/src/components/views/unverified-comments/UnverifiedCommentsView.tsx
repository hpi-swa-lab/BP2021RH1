import { Portal } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetUnverifiedCommentsQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { root } from '../../../helpers/app-helpers';
import { pushHistoryWithoutRouter } from '../../../helpers/history';
import { useCanUseUnverifiedCommentsView } from '../../../hooks/can-do-hooks';
import { FlatComment, FlatPicture } from '../../../types/additionalFlatTypes';
import Loading from '../../common/Loading';
import ProtectedRoute from '../../common/ProtectedRoute';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import PicturePreview from '../../common/picture-gallery/PicturePreview';
import PictureView from '../picture/PictureView';
import './UnverifiedCommentsView.scss';

const UnverifiedCommentsView = () => {
  const { t } = useTranslation();

  const [openPictureId, setOpenPictureId] = useState<string | undefined>(undefined);

  const { data, loading, error, refetch } = useGetUnverifiedCommentsQuery();
  const unverifiedComments: FlatComment[] | undefined =
    useSimplifiedQueryResponseData(data)?.comments;

  // Comments grouped by picture
  const groupedComments: { [key: string]: FlatComment[] | undefined } | undefined = useMemo(() => {
    if (!unverifiedComments) return undefined;
    const comments: { [key: string]: FlatComment[] | undefined } = {};
    unverifiedComments.forEach(comment => {
      const pictureId: string | undefined = comment.picture?.id;
      if (pictureId) {
        if (!comments[pictureId]) {
          comments[pictureId] = [];
        }
        comments[pictureId]?.push(comment);
      }
    });
    return comments;
  }, [unverifiedComments]);

  const allPictures: { [key: string]: FlatPicture } | undefined = useMemo(() => {
    if (!unverifiedComments) return undefined;
    const pictures: { [key: string]: FlatPicture } | undefined = {};
    unverifiedComments.forEach(comment => {
      if (comment.picture) {
        const pictureId: string = comment.picture.id;
        if (pictureId) {
          pictures[pictureId] = comment.picture;
        }
      }
    });
    return pictures;
  }, [unverifiedComments]);

  const { canUseUnverifiedCommentsView, loading: canUseUnverifiedCommentsViewLoading } =
    useCanUseUnverifiedCommentsView();

  return (
    <ProtectedRoute
      canUse={canUseUnverifiedCommentsView}
      canUseLoading={canUseUnverifiedCommentsViewLoading}
    >
      {() => {
        if (error) {
          return <QueryErrorDisplay error={error} />;
        } else if (loading && !groupedComments) {
          return <Loading />;
        } else if (groupedComments && allPictures) {
          return (
            <>
              <div className='comments-table'>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>{t('curator.unverified-comments')}</th>
                      <th>{t('common.count')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(groupedComments).map(pictureId => {
                      return (
                        <tr
                          key={pictureId}
                          onClick={() => {
                            pushHistoryWithoutRouter(`/picture/${pictureId}`);
                            setOpenPictureId(pictureId);
                          }}
                        >
                          <td className='picture-content'>
                            <PicturePreview picture={allPictures[pictureId]} onClick={() => {}} />
                          </td>
                          <td>
                            {groupedComments[pictureId]?.map(comment => (
                              <div key={comment.id} className='comment-preview'>
                                <span className='name'>{comment.author}:</span>
                                <span className='text'></span>
                                {comment.text.slice(0, 250)}
                                {comment.text.length >= 251 && '...'}
                              </div>
                            ))}
                          </td>
                          <td>{groupedComments[pictureId]?.length}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {openPictureId && (
                <Portal container={root}>
                  <PictureView
                    initialPictureId={openPictureId}
                    siblingIds={Object.keys(groupedComments)}
                    onBack={() => {
                      refetch();
                      setOpenPictureId(undefined);
                    }}
                  />
                </Portal>
              )}
            </>
          );
        } else {
          return <div>{t('curator.no-unverified-comments')}</div>;
        }
      }}
    </ProtectedRoute>
  );
};

export default UnverifiedCommentsView;
