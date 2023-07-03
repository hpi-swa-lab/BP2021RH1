import { Button, FormControl, FormHelperText, MenuItem, Select, TextField } from '@mui/material';
import { FormEvent, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useContactMutation, useGetArchiveNamesQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { useVisit } from '../../../helpers/history';
import { useOnChangeSetter } from '../../../hooks/onchange-setter.hook';
import { FlatArchiveTag } from '../../../types/additionalFlatTypes';
import { AlertContext, AlertType } from '../../provider/AlertProvider';

const ContactFormView = () => {
  const { t } = useTranslation();
  const { location } = useVisit();

  const [recipient, setRecipient] = useState('');
  const [senderName, setSenderName] = useState('');
  const [replyEmail, setReplyEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const { data } = useGetArchiveNamesQuery({
    variables: { filters: { email: { notNull: true } } },
  });

  const archiveNames: FlatArchiveTag[] | undefined =
    useSimplifiedQueryResponseData(data)?.archiveTags;

  useEffect(() => {
    setRecipient(
      archiveNames?.find(archiveName => archiveName.id === location.state?.archiveId)?.id ??
        archiveNames?.[0]?.id ??
        ''
    );
  }, [archiveNames, location.state?.archiveId]);

  const openAlert = useContext(AlertContext);

  const [contact] = useContactMutation();

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      await contact({
        variables: {
          recipient,
          sender_name: senderName,
          reply_email: replyEmail,
          subject,
          message,
        },
      });
      openAlert({
        alertType: AlertType.SUCCESS,
        message: t('contact-form.success'),
      });
      setSubject('');
      setMessage('');
    },
    [contact, recipient, senderName, replyEmail, subject, message, openAlert, t]
  );

  return (
    <div className='max-w-[1200px] min-h-full flex flex-col flex-nowrap items-center m-auto bg-white shadow-lg'>
      <div className='mx-auto mt-20 p-4'>
        <h1 className='pt-8'>{t('contact-form.title')}</h1>
        <form onSubmit={onSubmit} className='flex flex-col w-96'>
          <label className='flex flex-col flex-nowrap text-xl p-0'>
            <p className='mb-1'>{t('contact-form.choose-archive-label')}</p>
            <FormControl>
              <Select
                onChange={useOnChangeSetter(setRecipient)}
                value={recipient}
                className='max-w'
                required
              >
                {archiveNames?.map(archiveName => (
                  <MenuItem key={archiveName.id} value={archiveName.id}>
                    {archiveName.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{t('contact-form.choose-archive-helpertext')}</FormHelperText>
            </FormControl>
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
            <TextField onChange={useOnChangeSetter(setSubject)} value={subject} required />
          </label>
          <label className='flex flex-col flex-nowrap text-xl p-0 mb-5'>
            <p className='mb-1'>{t('contact-form.message-label')}</p>
            <TextField
              multiline
              onChange={useOnChangeSetter(setMessage)}
              minRows={3}
              value={message}
              required
            />
          </label>
          <Button variant='contained' type='submit'>
            {t('contact-form.submit-button-label').toString()}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactFormView;
