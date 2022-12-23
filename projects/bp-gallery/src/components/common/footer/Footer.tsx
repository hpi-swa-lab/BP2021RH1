import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className='footer'>
      <div className='footer-content'>
        <h3>{t('footer.title')}</h3>
        <div
          onClick={() => {
            window.open(`mailto:${process.env.REACT_APP_CONTACT_MAIL ?? ''}`);
          }}
        >
          Kontakt
        </div>
      </div>
    </div>
  );
};

export default Footer;
