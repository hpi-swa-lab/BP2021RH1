import { Button } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { asApiPath } from '../../../helpers/app-helpers';

const ContactFormView = () => {
  const { t } = useTranslation();

  const origin: string = window.location.origin;
  let apiPath: string = asApiPath('api/contact');

  return (
    <div className='contact-form-container flex flex-col flex-nowrap items-center m-auto p-4'>
      <h1 className='pt-8'>{t('contact-form.title')}</h1>
      <form
        action={apiPath}
        method='post'
        encType='multipart/form-data'
        target=''
        className='contact-form w-fit h-fit'
      >
        <div className='form-contents'>
          <p>
            <label className='flex flex-col flex-nowrap text-xl p-0'>
              {t('contact-form.choose-archive-label')}
              <select className='max-w h-6' name='recipient'>
                {/*    <option value='Test'>Test</option> */}
                <option value='Herbert-Ahrens-Archiv'>Herbert-Ahrens-Archiv</option>
              </select>
            </label>
          </p>
          <p>
            <label className='flex flex-col flex-nowrap text-xl p-0'>
              git
              {t('contact-form.name-label')}
              <input name='sender_name' className='form-input h-5 w-80 name-input' type='text' />
            </label>
          </p>
          <p>
            <label className='flex flex-col flex-nowrap text-xl p-0'>
              {t('contact-form.email-label')}
              <input name='email' className='form-input h-5 w-80 email-input' type='email' />
            </label>
          </p>
          <p>
            <label className='flex flex-col flex-nowrap text-xl p-0'>
              {t('contact-form.subject-label')}
              <input name='subject' className='form-input h-5 w-80 subject-input' />
            </label>
          </p>
          <p>
            <label className='flex flex-col flex-nowrap text-xl p-0'>
              {t('contact-form.message-label')}
              <textarea name='message' className='form-input max-w message-input h-20' />
            </label>
          </p>
          <div className='submit-button-container '></div>
          <Button
            className='submit-input'
            sx={{ 'background-color': '#7e241d', color: 'white' }}
            type='submit'
          >
            {t('contact-form.submit-button-label').toString()}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactFormView;
