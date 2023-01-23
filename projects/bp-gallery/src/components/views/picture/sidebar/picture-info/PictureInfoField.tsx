import React from 'react';
import { Icon } from 'mui';
import './PictureInfoField.scss';

const PictureInfoField = ({
  title,
  icon,
  children,
  type,
}: {
  title: string;
  icon: string;
  children: any;
  type?: string;
}) => {
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
