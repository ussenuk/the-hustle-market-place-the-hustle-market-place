import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import jsPDF from 'jspdf';

const PayPalButton = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handlePaymentSuccess = (details) => {
    console.log('Payment successful', details);

    // Set payment details to state
    setPaymentDetails(details);

    // Send the payment details to the backend API
    sendPaymentDetailsToBackend(details);

    // Download payment details PDF
    downloadPaymentDetailsPDF(details);
  };

  const sendPaymentDetailsToBackend = (details) => {
    // Extract relevant information from details
    const { id, intent, status, purchase_units, payer, create_time, update_time } = details;
    const { amount } = purchase_units[0];
    const { name, email_address, payer_id } = payer;
  
    // Prepare the data to send to the backend API
    const paymentData = {
      payment: {
        id: details.id,
        status: details.status,
        option: details.intent,
        create_time: details.create_time,
        update_time: details.update_time,
        payer: {
          name: details.payer.name.given_name + ' ' + details.payer.name.surname,
          email: details.payer.email_address,
          payer_id: details.payer.payer_id

        },
        

        purchase_units: [{
          amount: {
            value: details.purchase_units[0].amount.value,
            currency_code: details.purchase_units[0].amount.currency_code
          }
        }]
      },
      booking_id: details.payer.payer_id, // Assuming booking_id is directly available in details
      customer_id: sessionStorage.getItem('user_id') // Assuming customer_id is directly available in details
    };
  
    // Send the payment details to the backend API
    fetch('http://127.0.0.1:5555/savepayment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    }).then(response => {
      if (!response.ok) {
        throw new Error('Failed to save payment details');
      }
      return response.json(); // Parse JSON response
    }).then(data => {
      // Handle successful response
      console.log('Payment details saved successfully:', data);
    }).catch(error => {
      // Handle error
      console.error('Error saving payment details:', error);
    });
  };
  

  const downloadPaymentDetailsPDF = (paymentDetails) => {
    const doc = new jsPDF();
    doc.text('Payment Details', 10, 10);
    doc.text(`ID: ${paymentDetails.id}`, 10, 20);
    doc.text(`Intent: ${paymentDetails.intent}`, 10, 30);
    doc.text(`Amount: ${paymentDetails.purchase_units[0].amount.value} ${paymentDetails.purchase_units[0].amount.currency_code}`, 10, 40);
    doc.text(`Status: ${paymentDetails.status}`, 10, 50);
    doc.text(`Creation Time: ${paymentDetails.create_time}`, 10, 60);
    doc.text(`Update Time: ${paymentDetails.update_time}`, 10, 70);
    doc.text(`Payer Name: ${paymentDetails.payer.name.given_name} ${paymentDetails.payer.name.surname}`, 10, 80);
    doc.text(`Payer Email: ${paymentDetails.payer.email_address}`, 10, 90);
    doc.text(`Payer ID: ${paymentDetails.payer.payer_id}`, 10, 100);

    // Save the PDF
    doc.save('payment_details.pdf');
  };

  return (
    <div>
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

      {/* Render payment details if available */}
      {paymentDetails && (
        <div>
          <h2>Payment Details</h2>
          <p>ID: {paymentDetails.id}</p>
          <p>Intent: {paymentDetails.intent}</p>
          <p>Amount: {paymentDetails.purchase_units[0].amount.value} {paymentDetails.purchase_units[0].amount.currency_code}</p>
          <p>Status: {paymentDetails.status}</p>
          <p>Creation Time: {paymentDetails.create_time}</p>
          <p>Update Time: {paymentDetails.update_time}</p>
          <p>Payer Name: {paymentDetails.payer.name.given_name} {paymentDetails.payer.name.surname}</p>
          <p>Payer Email: {paymentDetails.payer.email_address}</p>
          <p>Payer ID: {paymentDetails.payer.payer_id}</p>
          {/* Render more details as needed */}
        </div>
      )}
    </div>
  );
};

export default PayPalButton;
