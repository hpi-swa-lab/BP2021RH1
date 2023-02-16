import { Icon } from '@mui/material';
import { PropsWithChildren } from 'react';
import './PictureInfoField.scss';

const PictureInfoField = ({
  title,
  icon,
  children,
  type,
}: PropsWithChildren<{
  title: string;
  icon: string;
  type?: string;
}>) => {
  return (
    <div className='picture-info-field' data-type={type}>
      <div className='icon-container'>
        <Icon>{icon}</Icon>
      </div>
      <div className='field-content'>
        <div className='field-title'>{title}</div>
        {children}
      </div>
    </div>
  );
};

export default PictureInfoField;
