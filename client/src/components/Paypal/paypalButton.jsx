import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PayPalButton = ({ isLoggedIn }) => {
  const handlePaymentSuccess = (details) => {
    console.log('Payment successful', details);
    // You can handle success action here, like showing a success message or redirecting
  };

  return (
    <div>
      {isLoggedIn && (
        <PayPalScriptProvider
          options={{
            'client-id': 'AcWQvHSSlSkxrmKJevzaG8nBgLKh5Z2z2f7wzlTcinCVFlK1N6otxDridE-WZ6pdXBSEMKOoUQqaaLAP',
            currency: 'USD',
          }}
        >
          <PayPalButtons
            style={{ layout: 'horizontal' }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: '10', // You can specify the amount here or pass it as a prop
                    },
                  },
                ],
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then(function(details) {
                handlePaymentSuccess(details);
              });
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default PayPalButton;
