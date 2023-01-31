import React, { useMemo, useState } from 'react';
import { useGetUnverifiedCommentsQuery } from '../../../graphql/APIConnector';
import Loading from '../../common/Loading';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import { FlatComment, FlatPicture } from '../../../types/additionalFlatTypes';
import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import PictureView from '../picture/PictureView';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import './UnverifiedCommentsView.scss';
import PicturePreview from '../../common/picture-gallery/PicturePreview';
import { Portal } from '@mui/material';
import { root } from '../../..';

const UnverifiedCommentsView = () => {
  const { t } = useTranslation();
  const { role } = useAuth();

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
};

export default UnverifiedCommentsView;
