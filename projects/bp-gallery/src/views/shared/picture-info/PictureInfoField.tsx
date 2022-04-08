import React from 'react';
import { Icon } from '@mui/material';
import './PictureInfoField.scss';

const PictureInfoField = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: any;
}) => {
  return (
    <div className='picture-info-field'>
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
