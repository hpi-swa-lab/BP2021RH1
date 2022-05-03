import React, { useMemo, useState } from 'react';
import { useGetUnverifiedCommentsQuery } from '../../graphql/APIConnector';
import Loading from '../shared/Loading';
import QueryErrorDisplay from '../shared/QueryErrorDisplay';
import { FlatComment } from '../../types/additionalFlatTypes';
import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import PictureView from '../picture/PictureView';
import { AuthRole, useAuth } from '../../AuthWrapper';
import './CommentOverview.scss';

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
    const ret: { [key: string]: FlatComment[] | undefined } = {};
    unverifiedComments.forEach(comment => {
      const pictureId: string | undefined = comment.picture?.id;
      if (pictureId) {
        if (!ret[pictureId]) {
          ret[pictureId] = [];
        }
        ret[pictureId]?.push(comment);
      }
    });
    return ret;
  }, [unverifiedComments]);

  if (role < AuthRole.CURATOR) {
    return <div>{t('common.authentication-needed')}</div>;
  } else if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading && !groupedComments) {
    return <Loading />;
  } else if (groupedComments) {
    return (
      <>
        <div className='scrollable-container'>
          <table>
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
                    <td>{pictureId}</td>
                    <td>{groupedComments[pictureId]?.map(comment => comment.text)}</td>
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
