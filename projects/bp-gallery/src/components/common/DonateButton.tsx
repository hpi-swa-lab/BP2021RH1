import { Button } from '@mui/material';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

const DonateButton = ({ clientId }: { clientId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [donation, setDonation] = useState('0.00');
  const paypalOptions = {
    'client-id': clientId,
    currency: 'EUR',
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <div className='max-w-xs'>
        <div className='flex place-content-center my-3 gap-1'>
          <CurrencyInput
            disabled={isOpen}
            id='donate-amount'
            className='w-fit text-lg'
            allowNegativeValue={false}
            placeholder='Bitte Spendenbetrag eingeben'
            decimalScale={2}
            decimalsLimit={2}
            suffix={'€'}
            onValueChange={(value, name) => setDonation(value ?? '0.00')}
          />
          <Button variant='outlined' onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Anpassen' : 'Spenden'}
          </Button>
        </div>
        {isOpen && (
          <>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: donation.replace(',', '.'),
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
          </>
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default DonateButton;
