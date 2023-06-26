import { Button, Dialog } from '@mui/material';
import { OnApproveActions, OnApproveData } from '@paypal/paypal-js';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useCallback, useRef, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useTranslation } from 'react-i18next';
import PrimaryButton from './PrimaryButton';

const DonateButton = ({
  clientId,
  donationText,
  purposeText,
}: {
  clientId: string;
  donationText?: string;
  purposeText?: string;
}) => {
  const { t } = useTranslation();
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState('');
  const [donation, setDonation] = useState('0.00');
  const transitionRef = useRef(null);
  const paypalOptions = {
    'client-id': clientId,
    currency: 'EUR',
  };

  const onApprove = useCallback(
    async (data: OnApproveData, actions: OnApproveActions) => {
      await actions.order?.capture();
      setDialogText(t('archives.edit.paypal.thankyou-label', { amount: donation }));
      setIsDialogOpen(true);
    },
    [t, donation]
  );

  const onError = useCallback(
    (err: any) => {
      setDialogText(t('archives.edit.paypal.error-label'));
      setIsDialogOpen(true);
    },
    [t]
  );

  return (
    <>
      <Dialog open={isDialogOpen}>
        <div className='border-solid w-[35rem] h-[25rem] justify-center items-center flex flex-col gap-4 text-2xl'>
          <div>{dialogText}</div>
          <PrimaryButton onClick={() => setIsDialogOpen(false)}>{t('common.close')}</PrimaryButton>
        </div>
      </Dialog>
      <PayPalScriptProvider options={paypalOptions}>
        <div className='max-w-xs grid grid-cols-1 auto-rows-min gap-2'>
          {isClicked ? (
            <>
              <div className='text-lg text-center'>{donationText}</div>
              <div className='flex flex-col md:flex-row align-center my-3 gap-1 h-8'>
                <CurrencyInput
                  disabled={isOpen}
                  id='donate-amount'
                  className='w-fit text-lg'
                  allowNegativeValue={false}
                  placeholder={t('archives.edit.paypal.currency-label')}
                  decimalScale={2}
                  decimalsLimit={2}
                  suffix={'€'}
                  onValueChange={(value, name) => {
                    value && setDonation(() => value.replace(',', '.'));
                  }}
                />
                <Button
                  variant='outlined'
                  onClick={() => (parseFloat(donation) > 0 ? setIsOpen(!isOpen) : '')}
                >
                  {isOpen
                    ? t('archives.edit.paypal.donation-edit')
                    : t('archives.edit.paypal.donation-default')}
                </Button>
              </div>
            </>
          ) : (
            <PrimaryButton onClick={() => setIsClicked(true)}>
              {t('archives.edit.paypal.donation-default')}
            </PrimaryButton>
          )}

          {isOpen && (
            <div ref={transitionRef} className='overflow-hidden animate-paypal-open'>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        description: purposeText,
                        amount: {
                          value: donation,
                        },
                      },
                    ],
                  });
                }}
                style={{
                  layout: 'vertical',
                  tagline: false,
                }}
                onApprove={onApprove}
                onError={onError}
              />
            </div>
          )}
        </div>
      </PayPalScriptProvider>
    </>
  );
};

export default DonateButton;
