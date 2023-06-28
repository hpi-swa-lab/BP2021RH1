import { IconButton, Tooltip } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';

const IconButtonWithTooltip = ({
  title,
  onClick,
  icon,
  disabled,
}: {
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  icon: ReactNode;
  disabled?: boolean;
}) => {
  return (
    <Tooltip title={title} arrow={true} followCursor={true} placement='left'>
      <IconButton onClick={onClick} disabled={disabled}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default IconButtonWithTooltip;
