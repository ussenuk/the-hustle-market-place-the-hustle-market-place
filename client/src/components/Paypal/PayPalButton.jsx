import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import jsPDF from 'jspdf';

const PayPalButton = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [userName, setUserName] = useState('');

  const handlePaymentSuccess = (details) => {
    console.log('Payment successful', details);
    setPaymentDetails(details);
    sendPaymentDetailsToBackend(details);
    fetchUserName();  // Fetch user name after payment is processed.
  };

  const sendPaymentDetailsToBackend = (details) => {
    const paymentData = {
      payment: {
        id: details.id,
        status: details.status,
        option: details.intent,
        create_time: details.create_time,
        update_time: details.update_time,
        payer: {
          name: `${details.payer.name.given_name} ${details.payer.name.surname}`,
          email: details.payer.email_address,
          payer_id: details.payer.payer_id,
        },
        purchase_units: [{
          amount: {
            value: details.purchase_units[0].amount.value,
            currency_code: details.purchase_units[0].amount.currency_code,
          },
        }],
      },
      booking_id: details.payer.payer_id,  // Assuming booking_id is directly available in details.
      customer_id: sessionStorage.getItem('user_id')  // Assuming customer_id is stored in session.
    };

    fetch('/savepayment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save payment details');
      }
      return response.json();
    })
    .then(data => {
      console.log('Payment details saved successfully:', data);
    })
    .catch(error => {
      console.error('Error saving payment details:', error);
    });
  };

  const fetchUserName = async () => {
    try {
      // Assuming the endpoint to fetch the username, replace with actual endpoint if different.
      const response = await fetch('/get_logged_in_username');
      if (response.ok) {
        const data = await response.json();
        setUserName(data.username);
      } else {
        throw new Error('Failed to fetch user name');
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  const downloadPaymentDetailsPDF = () => {
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

    doc.save('payment_details.pdf');
  };

  return (
    <div>
      <PayPalScriptProvider options={{ 'client-id': 'your-paypal-client-id', currency: 'USD' }}>
        <PayPalButtons
          style={{ layout: 'horizontal' }}
          createOrder={(data, actions) => actions.order.create({
            purchase_units: [{ amount: { value: '10' }}]  // Set the payment amount.
          })}
          onApprove={(data, actions) => actions.order.capture().then(handlePaymentSuccess)}
        />
      </PayPalScriptProvider>

      {paymentDetails && (
        <div>
          <h2>Payment Details</h2>
          <p>ID: {paymentDetails.id}</p>
          <p>Intent: {paymentDetails.intent}</p>
          <p>Status: {paymentDetails.status}</p>
          <p>Creation Time: {paymentDetails.create_time}</p>
          <p>Update Time: {paymentDetails.update_time}</p>
          <p>Payer ID: {paymentDetails.payer.payer_id}</p>
          <p>Thank you, your payment is complete.</p>
          <button onClick={downloadPaymentDetailsPDF}>Download Details</button>
        </div>
      )}
    </div>
  );
};

export default PayPalButton;
