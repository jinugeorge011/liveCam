import React, { useEffect } from "react";

const Payment = () => {
  const loadGooglePay = async () => {
    // Check if Google Pay is available
    if (!window.google) {
      console.error("Google Pay SDK not loaded.");
      return;
    }

    const paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: "TEST", // Change to 'PRODUCTION' when ready
    });

    const isReadyToPayRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
            allowedCardNetworks: ["MASTERCARD", "VISA"],
          },
          tokenizationSpecification: {
            type: "PAYMENT_GATEWAY",
            parameters: {
              gateway: "stripe", // Or your payment gateway
              "stripe:version": "2022-11-15",
              "stripe:publishableKey": "pk_test_YOUR_PUBLIC_KEY_HERE", // Replace with your Stripe public key
            },
          },
        },
      ],
    };

    try {
      const isReadyToPay = await paymentsClient.isReadyToPay(isReadyToPayRequest);

      if (isReadyToPay.result) {
        const button = paymentsClient.createButton({
          onClick: () => processPayment(paymentsClient),
        });
        document.getElementById("google-pay-button").appendChild(button);
      } else {
        console.error("Google Pay is not available on this device.");
      }
    } catch (error) {
      console.error("Error checking Google Pay availability:", error);
    }
  };

  const processPayment = async (paymentsClient) => {
    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
            allowedCardNetworks: ["MASTERCARD", "VISA"],
          },
          tokenizationSpecification: {
            type: "PAYMENT_GATEWAY",
            parameters: {
              gateway: "stripe",
              "stripe:version": "2022-11-15",
              "stripe:publishableKey": "pk_test_YOUR_PUBLIC_KEY_HERE", // Replace with your Stripe public key
            },
          },
        },
      ],
      transactionInfo: {
        totalPriceStatus: "FINAL",
        totalPrice: "10.00", // Replace with dynamic pricing
        currencyCode: "INR",
        countryCode: "IND",
      },
      merchantInfo: {
        merchantId: "YOUR_MERCHANT_ID_HERE",
        merchantName: "Your Business Name",
      },
    };

    try {
      const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
      console.log("Payment Data:", paymentData);

      // Send paymentData to your backend for processing
      // Example: await fetch('/process-payment', { method: 'POST', body: JSON.stringify(paymentData) });
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://pay.google.com/gp/p/js/pay.js";
    script.async = true;
    script.onload = loadGooglePay;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <h1>Checkout</h1>
      <div id="google-pay-button"></div>
    </div>
  );
};

export default Payment;
