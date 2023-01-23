import React from 'react';
import { IconButton, styled, Tooltip, tooltipClasses, TooltipProps, HelpOutline } from 'mui';

export const SearchInfoTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }}>
    <IconButton className={'info-icon'}>
      <HelpOutline />
    </IconButton>
  </Tooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 220,

    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));
