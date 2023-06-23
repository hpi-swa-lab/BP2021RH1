import { useTranslation } from 'react-i18next';
import { useVisit } from '../../../helpers/history';
import './Footer.scss';

const Footer = () => {
  const { t } = useTranslation();
  const { visit } = useVisit();

  return (
    <div className='footer'>
      <div className='footer-content'>
        <div className='footer-info'>
          <h3>{t('footer.title')}</h3>
          {/*  
          <p>
          {t('footer.privacy')}
          </p>
          */}
          <p onClick={() => visit('/terms-of-service')}>{t('footer.tos')}</p>
        </div>

        <div className='footer-associates'>
          <h3>{t('footer.associates-title')}</h3>
          <div className='associates-logos'>
            <div className='logo'>
              <img src='/partner-logos/landkreis.png' />
            </div>
            <div className='logo square'>
              <img src='/partner-logos/Bad-Harzburg-Wappen.png' />
            </div>
            <div className='logo'>
              <img src='/partner-logos/goslar-zeitung.png' />
            </div>
            <div className='logo'>
              <img src='/partner-logos/braunlage.png' />
            </div>
            <div className='logo'>
              <img src='/partner-logos/harzkurier.png' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
