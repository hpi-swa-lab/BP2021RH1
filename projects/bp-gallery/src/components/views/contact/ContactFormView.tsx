import { MenuItem, Select, TextField } from '@mui/material';
import { FormEvent, useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { asApiPath } from '../../../helpers/app-helpers';
import { useOnChangeSetter } from '../../../hooks/onchange-setter.hook';
import PrimaryButton from '../../common/PrimaryButton';
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
    <div className='max-w-[1200px] h-full flex flex-col flex-nowrap items-center m-auto bg-white shadow-lg'>
      <div className='mx-auto mt-20 p-4'>
        <h1 className='pt-8'>{t('contact-form.title')}</h1>
        <form onSubmit={onSubmit} className='flex flex-col w-96'>
          <label className='flex flex-col flex-nowrap text-xl p-0'>
            <p className='mb-1'>{t('contact-form.choose-archive-label')}</p>
            <Select onChange={useOnChangeSetter(setRecipient)} value={recipient} className='max-w'>
              {/* <MenuItem value='Test'>Test</MenuItem> */}
              <MenuItem value='Herbert-Ahrens-Archiv'>Herbert-Ahrens-Archiv</MenuItem>
            </Select>
          </label>
          <label className='flex flex-col flex-nowrap text-xl p-0'>
            <p className='mb-1'>{t('contact-form.name-label')}</p>
            <TextField onChange={useOnChangeSetter(setSenderName)} value={senderName} type='text' />
          </label>
          <label className='flex flex-col flex-nowrap text-xl p-0'>
            <p className='mb-1'>{t('contact-form.email-label')}</p>
            <TextField
              onChange={useOnChangeSetter(setReplyEmail)}
              value={replyEmail}
              type='email'
            />
          </label>
          <label className='flex flex-col flex-nowrap text-xl p-0 h-full'>
            <p className='mb-1'>{t('contact-form.subject-label')}</p>
            <TextField onChange={useOnChangeSetter(setSubject)} value={subject} />
          </label>
          <label className='flex flex-col flex-nowrap text-xl p-0 mb-5'>
            <p className='mb-1'>{t('contact-form.message-label')}</p>
            <TextField
              multiline
              onChange={useOnChangeSetter(setMessage)}
              minRows={3}
              value={message}
            />
          </label>
          <PrimaryButton type='submit' className='!w-full'>
            {t('contact-form.submit-button-label').toString()}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
};

export default ContactFormView;
