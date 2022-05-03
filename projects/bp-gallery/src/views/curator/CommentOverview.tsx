import React, { useMemo, useState } from 'react';
import { useGetUnverifiedCommentsQuery } from '../../graphql/APIConnector';
import Loading from '../shared/Loading';
import QueryErrorDisplay from '../shared/QueryErrorDisplay';
import { FlatComment, FlatPicture } from '../../types/additionalFlatTypes';
import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import PictureView from '../picture/PictureView';
import { AuthRole, useAuth } from '../../AuthWrapper';
import './CommentOverview.scss';
import PicturePreview from '../gallery/shared/PicturePreview';

const CommentOverview = () => {
  const { t } = useTranslation();
  const { role } = useAuth();

  const [openPictureId, setOpenPictureId] = useState<string | undefined>(undefined);

  const { data, loading, error } = useGetUnverifiedCommentsQuery();
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

  if (role < AuthRole.CURATOR) {
    return <div>{t('common.authentication-needed')}</div>;
  } else if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading && !groupedComments) {
    return <Loading />;
  } else if (groupedComments && allPictures) {
    return (
      <>
        <div className='scrollable-container'>
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
                      window.history.pushState({}, '', `/picture/${pictureId}`);
                      setOpenPictureId(pictureId);
                    }}
                  >
                    <td>
                      <PicturePreview picture={allPictures[pictureId]} onClick={() => {}} />
                    </td>
                    <td>{groupedComments[pictureId]?.map(comment => comment.text)}</td>
                    <td>{groupedComments[pictureId]?.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {openPictureId && (
          <PictureView
            initialPictureId={openPictureId}
            siblingIds={Object.keys(groupedComments)}
            onBack={() => {
              setOpenPictureId(undefined);
            }}
          />
        )}
      </>
    );
  } else {
    return <div>{t('curator.no-unverified-comments')}</div>;
  }
};

export default CommentOverview;
