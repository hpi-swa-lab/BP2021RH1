import { IconButton, Tooltip } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';

const IconButtonWithTooltip = ({
  title,
  onClick,
  icon,
}: {
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  icon: ReactNode;
}) => {
  return (
    <Tooltip title={title} arrow={true} followCursor={true} placement='left'>
      <IconButton onClick={onClick}>{icon}</IconButton>
    </Tooltip>
  );
};

export default IconButtonWithTooltip;
