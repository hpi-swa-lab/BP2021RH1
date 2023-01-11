import React from 'react';
import './ContactFormView.scss';
import { useTranslation } from 'react-i18next';

const ContactFormView = () => {
  const { t } = useTranslation();
  return (
    <div className='contact-form-container'>
        <h2>
        {t('contact-form.title')}
        </h2>
        <form className='contact-form'>
            <div className='form-contents'>
                <p>
                    <label>
                        {t('contact-form.choose-archive-label')}
                        <select>
                            <option value='j.schueler92@gmx.de'>Test</option>
                            <option value='bcpresse@gmail.com'>Herbert-Ahrens-Archiv</option>
                        </select>
                    </label>
                </p>
                <p>
                    <label>
                        {t('contact-form.name-label')}
                        <input className = 'form-input name-input' type = 'text'/>
                    </label>
                </p>
                <p>
                    <label>
                        {t('contact-form.email-label')}
                        <input className = 'form-input email-input' type = 'email'/>
                    </label>
                </p>
                <p>
                    <label>
                        {t('contact-form.subject-label')}
                        <input className = 'form-input subject-input' type = 'email'/>
                    </label>
                </p>
                <p>
                    <label>
                        {t('contact-form.message-label')}
                        <textarea className='form-input message-input'/>
                    </label>
                </p>
            </div>    
            <div className='submit-button-container'>
                <input className='submit-input' type ='submit' value={t('contact-form.submit-button-label').toString()}/>
            </div>
        </form>
    </div>
  );
};

export default ContactFormView;
