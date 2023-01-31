import React, { ReactNode } from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { IconButton, styled, Tooltip, tooltipClasses, Typography } from '@mui/material';

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
        <HelpOutlineIcon />
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
