import { ReactNode } from 'react';
import { HelpOutline } from '@mui/icons-material';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';

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
