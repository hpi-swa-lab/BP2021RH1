import { Button } from '@mui/material';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

const DonateButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [donation, setDonation] = useState('0.01');
  console.log(donation);
  return (
    <div className='max-w-xs'>
      <CurrencyInput
        disabled={isOpen}
        id='donate-amount'
        className='w-fit'
        allowNegativeValue={false}
        placeholder='Bitte Spendenbetrag eingeben'
        decimalScale={2}
        decimalsLimit={2}
        suffix={'€'}
        onValueChange={(value, name) => setDonation(value ?? '0.01')}
      />
      <Button variant='outlined' onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Spenden einklappen' : 'Spenden'}
      </Button>
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
  );
};

export default DonateButton;
