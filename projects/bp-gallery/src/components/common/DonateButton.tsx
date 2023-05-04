import { Button } from '@mui/material';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useEffect, useRef, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import './DonateButton.scss';
import PrimaryButton from './PrimaryButton';

const DonateButton = ({ clientId, donationText }: { clientId: string; donationText?: string }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [donation, setDonation] = useState('0.00');
  const transitionRef = useRef(null);
  const paypalOptions = {
    'client-id': clientId,
    currency: 'EUR',
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(function () {
        transitionRef.current.className = 'parent-active';
      }, 20);
    }
  }, [isOpen]);

  return (
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
                placeholder='Bitte Spendenbetrag eingeben'
                decimalScale={2}
                decimalsLimit={2}
                suffix={'€'}
                onValueChange={(value, name) => {
                  value && setDonation(() => value.replace(',', '.'));
                }}
              />
              <Button
                variant='outlined'
                onClick={() => (parseInt(donation) > 0 ? setIsOpen(!isOpen) : '')}
              >
                {isOpen ? 'Anpassen' : 'Spenden'}
              </Button>
            </div>
          </>
        ) : (
          <PrimaryButton onClickFn={() => setIsClicked(true)}>Spenden</PrimaryButton>
        )}

        {isOpen && (
          <div ref={transitionRef} className='paypal-parent'>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
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
            />
          </div>
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default DonateButton;
