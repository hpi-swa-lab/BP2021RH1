import React from 'react';
import './ContactFormView.scss';
import { useTranslation } from 'react-i18next';

const ContactFormView = () => {
  const { t } = useTranslation();
  return (
    <div className='conact-form-container'>
        <h2>
        {t('contact-form.title')}
        </h2>
        <form className='contact-form'>
            <div className='contact-form-choose-archiv-container'>
                <label>{t('contact-form.choose-archive-label')}</label>
                <select>
                    <option value='j.schueler92@gmx.de'>Test</option>
                    <option value='bcpresse@gmail.com'>Herbert-Ahrens-Archiv</option>
                </select>
            </div>
            <div className='contact-form-input-container'>
                <label>{t('contact-form.input-label')}</label>
                <input type='text'></input>
            </div>
            <div className='contact-form-submit-button-container'>
                <input type ='submit' value={t('contact-form.submit-button-label').toString()}></input>
            </div>
        </form>
    </div>
  );
};

export default ContactFormView;
