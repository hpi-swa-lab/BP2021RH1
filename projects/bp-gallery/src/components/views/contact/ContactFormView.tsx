import { Button } from '@mui/material';
import { FormEvent, useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { asApiPath } from '../../../helpers/app-helpers';
import { useOnChangeSetter } from '../../../hooks/onchange-setter.hook';
import { AlertContext, AlertType } from '../../provider/AlertProvider';

const ContactFormView = () => {
  const { t } = useTranslation();

  const [recipient, setRecipient] = useState('Herbert-Ahrens-Archiv');
  const [senderName, setSenderName] = useState('');
  const [replyEmail, setReplyEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const openAlert = useContext(AlertContext);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append('recipient', recipient);
      formData.append('sender_name', senderName);
      formData.append('reply_email', replyEmail);
      formData.append('subject', subject);
      formData.append('message', message);

      try {
        await fetch(asApiPath('/api/contact'), { method: 'post', body: formData });
        openAlert({
          alertType: AlertType.SUCCESS,
          message: t('contact-form.success'),
        });
        setSubject('');
        setMessage('');
      } catch (error) {
        openAlert({
          alertType: AlertType.ERROR,
          message: error as string,
        });
      }
    },
    [recipient, senderName, replyEmail, subject, message, openAlert, t]
  );

  return (
    <div className='contact-form-container flex flex-col flex-nowrap items-center m-auto p-4'>
      <h1 className='pt-8'>{t('contact-form.title')}</h1>
      <form onSubmit={onSubmit} className='contact-form w-fit h-fit'>
        <div className='form-contents'>
          <p>
            <label className='flex flex-col flex-nowrap text-xl p-0'>
              {t('contact-form.choose-archive-label')}
              <select
                onChange={useOnChangeSetter(setRecipient)}
                value={recipient}
                className='max-w h-6'
              >
                <option value='Test'>Test</option>
                <option value='Herbert-Ahrens-Archiv'>Herbert-Ahrens-Archiv</option>
              </select>
            </label>
          </p>
          <p>
            <label className='flex flex-col flex-nowrap text-xl p-0'>
              {t('contact-form.name-label')}
              <input
                onChange={useOnChangeSetter(setSenderName)}
                value={senderName}
                className='form-input h-5 w-80 name-input'
                type='text'
              />
            </label>
          </p>
          <p>
            <label className='flex flex-col flex-nowrap text-xl p-0'>
              {t('contact-form.email-label')}
              <input
                onChange={useOnChangeSetter(setReplyEmail)}
                value={replyEmail}
                className='form-input h-5 w-80 email-input'
                type='email'
              />
            </label>
          </p>
          <p>
            <label className='flex flex-col flex-nowrap text-xl p-0'>
              {t('contact-form.subject-label')}
              <input
                onChange={useOnChangeSetter(setSubject)}
                value={subject}
                className='form-input h-5 w-80 subject-input'
              />
            </label>
          </p>
          <p>
            <label className='flex flex-col flex-nowrap text-xl p-0'>
              {t('contact-form.message-label')}
              <textarea
                onChange={useOnChangeSetter(setMessage)}
                value={message}
                className='form-input max-w message-input h-20'
              />
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
