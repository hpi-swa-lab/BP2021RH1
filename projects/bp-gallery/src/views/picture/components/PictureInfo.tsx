import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PictureDetails from './PictureDetails';
import CommentsContainer from './comments/CommentsContainer';
import { Accordion, AccordionDetails, AccordionSummary, Icon } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FlatPicture } from '../../../graphql/additionalFlatTypes';

const PictureInfo = ({
  picture,
  pictureId,
  calculateHeight,
}: {
  picture: FlatPicture;
  pictureId: string;
  calculateHeight: (container: HTMLElement) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className='details'>
      <div className='title'>{picture.title?.text ?? ''}</div>
      <PerfectScrollbar
        options={{ suppressScrollX: true }}
        onScrollY={container => {
          calculateHeight(container);
        }}
      >
        <Accordion expanded={true}>
          <AccordionSummary>
            <Icon>info</Icon>
            {t('common.details')}
          </AccordionSummary>
          <AccordionDetails>
            <PictureDetails descriptions={picture.descriptions} />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary style={{ fontSize: '25px' }}>
            <Icon>question_answer</Icon>
            {t('common.comments')} ({picture.comments?.length ?? 0})
          </AccordionSummary>
          <AccordionDetails>
            <CommentsContainer comments={picture.comments} pictureId={pictureId} />
          </AccordionDetails>
        </Accordion>
      </PerfectScrollbar>
    </div>
  );
};

export default PictureInfo;
