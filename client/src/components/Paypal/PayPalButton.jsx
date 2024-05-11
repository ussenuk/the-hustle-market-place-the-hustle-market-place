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
    fetchUserName();
  };

  const sendPaymentDetailsToBackend = (details) => {
    // Prepare and send payment data to your backend
    const paymentData = {
      // your payment data structure
    };

    fetch('http://127.0.0.1:5555/savepayment', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(data => console.log('Payment details saved successfully:', data))
    .catch(error => console.error('Error saving payment details:', error));
  };

  const fetchUserName = async () => {
    // Fetch user name logic
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

    // Save the PDF
    doc.save('payment_details.pdf');
  };

  return (
    <div>
      <PayPalScriptProvider options={{ 'client-id': 'AcWQvHSSlSkxrmKJevzaG8nBgLKh5Z2z2f7wzlTcinCVFlK1N6otxDridE-WZ6pdXBSEMKOoUQqaaLAP', currency: 'USD' }}>
        <PayPalButtons
          style={{ layout: 'horizontal' }}
          createOrder={(data, actions) => actions.order.create({
            purchase_units: [{ amount: { value: '10' }}]
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
          <p>Thank you {userName}, your payment is complete.</p>
          <button onClick={downloadPaymentDetailsPDF}>Download Payment Details</button>
        </div>
      )}
    </div>
  );
};

export default PayPalButton;
