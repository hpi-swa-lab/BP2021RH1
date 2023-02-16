import React from 'react';
import './ContactFormView.scss';
import { useTranslation } from 'react-i18next';

const ContactFormView = () => {
    const { t } = useTranslation();

    const origin: string = window.location.origin
    let apiPath:string
    const regex = RegExp('localhost')
    if (regex.exec(origin)){
        apiPath = "http://localhost:9000/api/contact"
    }
    else{
        apiPath = "https://harz-history/api/contact"
    }
    
  return (
    <div className='contact-form-container'>
        <h1>
        {t('contact-form.title')}
        </h1>
        <form action={apiPath} method='post' encType='multipart/form-data' target="" className='contact-form' >
            <div className='form-contents'>
                <p>
                    <label>
                        {t('contact-form.choose-archive-label')}
                        <select name="recipient">
                        {/*    <option value='Test'>Test</option> */} 
                            <option value='Herbert-Ahrens-Archiv'>Herbert-Ahrens-Archiv</option>
                        </select>
                    </label>
                </p>
                <p>
                    <label>
                        {t('contact-form.name-label')}
                        <input name="sender_name" className = 'form-input name-input' type = 'text'/>
                    </label>
                </p>
                <p>
                    <label>
                        {t('contact-form.email-label')}
                        <input name="email" className = 'form-input email-input' type = 'email'/>
                    </label>
                </p>
                <p>
                    <label>
                        {t('contact-form.subject-label')}
                        <input name="subject" className = 'form-input subject-input'/>
                    </label>
                </p>
                <p>
                    <label>
                        {t('contact-form.message-label')}
                        <textarea name="message" className='form-input message-input'/>
                    </label>
                </p>
            </div>    
            <div className='submit-button-container'>
                <button className='submit-input' type ='submit'>
                    {t('contact-form.submit-button-label').toString()}
                </button>
                
            </div>
        </form>
    </div>
  );
};

export default ContactFormView;
