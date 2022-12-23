import React from 'react';
import './Footer.scss';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const history: History = useHistory();

  return (
    <div className='footer'>
      <div className='footer-content'>
        <h3>{t('footer.title')}</h3>

        <p
          onClick={() => {
            window.open(`mailto:${process.env.REACT_APP_CONTACT_MAIL ?? ''}`);
          }}
        >
          {t('footer.contact')}
        </p>
        {/*  
        <p>
        {t('footer.privacy')}
        </p>
        */}
        <p onClick={() => history.push('/terms-of-service', { showBack: false })}>
          {t('footer.tos')}
        </p>
      </div>
    </div>
  );
};

export default Footer;
