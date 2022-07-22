import React from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { IconButton, styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';

export const SearchInfoTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }}>
    <IconButton className={'info-icon'}>
      <HelpOutlineIcon />
    </IconButton>
  </Tooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 220,

    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));
