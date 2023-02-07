import './TermsOfServiceView.scss';
import ScrollContainer from '../../common/ScrollContainer';
import { useTranslation } from 'react-i18next';

const TermsOfServiceView = () => {
  const { t } = useTranslation();
  return (
    <div className='tos-content-container'>
      <ScrollContainer>
        {(scrollPos: number, scrollHeight: number) => (
          <div className='tos-content'>
            <h2>{t('terms-of-service.title')}</h2>

            <p>{t('terms-of-service.introduction-p1')}</p>
            <p>{t('terms-of-service.introduction-p2')}</p>

            <h3>{t('terms-of-service.permitted-usage-title')}</h3>

            <p>{t('terms-of-service.permitted-usage-p1')}</p>

            <p>
              {t('terms-of-service.permitted-usage-p2-1')}
              <span className='bold'>{t('terms-of-service.permitted-usage-p2-2-bold')}</span>
              {t('terms-of-service.permitted-usage-p2-3')}
            </p>

            <p>
              {t('terms-of-service.permitted-usage-p3-1')}
              <span className='bold'>{t('terms-of-service.permitted-usage-p3-2-bold')}</span>
              {t('terms-of-service.permitted-usage-p3-3')}
              <a href={t('terms-of-service.permitted-usage-p3-4-link-href')}>
                {t('terms-of-service.permitted-usage-p3-4-link')}
              </a>
            </p>

            <p>{t('terms-of-service.permitted-usage-p3-5')}</p>

            <h3>{t('terms-of-service.media-upload-title')}</h3>
            <p>{t('terms-of-service.media-upload-p1')}</p>
            <p>{t('terms-of-service.media-upload-p2')}</p>
            <p>
              {t('terms-of-service.media-upload-p3-1')}
              <a href={t('terms-of-service.media-upload-p3-2-link-href')}>
                {t('terms-of-service.media-upload-p3-2-link')}
              </a>
              {t('terms-of-service.media-upload-p3-3')}
            </p>

            <h3>{t('terms-of-service.liability-transfer-title')}</h3>
            <p>{t('terms-of-service.liability-transfer-p1')}</p>
          </div>
        )}
      </ScrollContainer>
    </div>
  );
};

export default TermsOfServiceView;
