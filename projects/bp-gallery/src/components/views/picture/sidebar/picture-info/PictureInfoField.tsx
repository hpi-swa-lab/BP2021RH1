import { PropsWithChildren } from 'react';
import './PictureInfoField.scss';

const PictureInfoField = ({
  title,
  icon,
  children,
  type,
}: PropsWithChildren<{
  title: string;
  icon: JSX.Element;
  type?: string;
}>) => {
  return (
    <div className='picture-info-field' data-type={type}>
      <div className='icon-container'>{icon}</div>
      <div className='field-content'>
        <div className='field-title'>{title}</div>
        {children}
      </div>
    </div>
  );
};

export default PictureInfoField;
