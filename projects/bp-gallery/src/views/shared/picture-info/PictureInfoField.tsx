import React from 'react';
import { Icon } from '@mui/material';
import './PictureInfoField.scss';
import { AuthRole, useAuth } from '../../../AuthWrapper';

const PictureInfoField = ({
  title,
  icon,
  children,
  type,
  empty = false,
}: {
  title: string;
  icon: string;
  children: any;
  type?: string;
  empty?: boolean;
}) => {
  const { role } = useAuth();

  if (empty && role < AuthRole.CURATOR) {
    return null;
  }
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
