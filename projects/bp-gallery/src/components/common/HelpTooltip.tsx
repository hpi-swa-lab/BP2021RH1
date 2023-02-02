import React, { ReactNode } from 'react';
import { HelpOutline, IconButton, styled, Tooltip, tooltipClasses, Typography } from 'mui';

export const HelpTooltip = styled(
  ({ title, content, className }: { title: ReactNode; content: ReactNode; className?: string }) => (
    <Tooltip
      title={
        <>
          <Typography color='inherit'>{title}</Typography>
          <p>{content}</p>
        </>
      }
      classes={{ popper: className }}
    >
      <IconButton className={'info-icon'}>
        <HelpOutline />
      </IconButton>
    </Tooltip>
  )
)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 220,

    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));
