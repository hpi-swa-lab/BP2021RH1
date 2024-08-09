import { HelpOutline } from '@mui/icons-material';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';

export const HelpTooltip = styled(
  ({
    title,
    content,
    popupClassName,
    iconClassName,
  }: {
    title: ReactNode;
    content: ReactNode;
    popupClassName?: string;
    iconClassName?: string;
  }) => (
    <Tooltip
      title={
        <>
          <Typography color='inherit'>{title}</Typography>
          <p>{content}</p>
        </>
      }
      classes={{ popper: popupClassName }}
    >
      <IconButton className={`info-icon ${iconClassName ?? ''}`}>
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
