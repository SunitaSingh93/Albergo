import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/payment';

// Create axios instance with default config
const paymentApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
paymentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Create Razorpay order
export const createRazorpayOrder = async (bookingData) => {
  try {
    const response = await paymentApi.post('/create-order', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error(error.response?.data?.message || 'Failed to create payment order');
  }
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (paymentData) => {
  try {
    const response = await paymentApi.post('/verify-payment', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error(error.response?.data?.message || 'Failed to verify payment');
  }
};

// Completely dummy Razorpay payment handler (no real API calls)
export const initiateDummyRazorpayPayment = (orderData, onSuccess, onFailure) => {
  console.log('Initiating dummy Razorpay payment for order:', orderData);
  
  // Create a custom dummy payment modal instead of using real Razorpay
  const createDummyPaymentModal = () => {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      font-family: Arial, sans-serif;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    `;

    modal.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="width: 60px; height: 60px; background: #528FF0; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 24px;">💳</span>
        </div>
        <h2 style="margin: 0; color: #333; font-size: 20px;">Razorpay Payment</h2>
        <p style="margin: 8px 0 0; color: #666; font-size: 14px;">Hotel Management System</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #666;">Room ${orderData.roomId}</span>
          <span style="font-weight: bold;">₹${(orderData.amount / 100).toFixed(2)}</span>
        </div>
        <div style="font-size: 12px; color: #888;">Order ID: ${orderData.orderId}</div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; color: #333; font-size: 14px;">Card Number</label>
        <input type="text" placeholder="1234 5678 9012 3456" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" maxlength="19">
        
        <div style="display: flex; gap: 12px; margin-top: 12px;">
          <div style="flex: 1;">
            <label style="display: block; margin-bottom: 8px; color: #333; font-size: 14px;">Expiry</label>
            <input type="text" placeholder="MM/YY" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" maxlength="5">
          </div>
          <div style="flex: 1;">
            <label style="display: block; margin-bottom: 8px; color: #333; font-size: 14px;">CVV</label>
            <input type="text" placeholder="123" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" maxlength="3">
          </div>
        </div>
      </div>
      
      <div style="display: flex; gap: 12px;">
        <button id="cancelPayment" style="flex: 1; padding: 12px; border: 1px solid #ddd; background: white; color: #666; border-radius: 6px; cursor: pointer; font-size: 14px;">Cancel</button>
        <button id="payNow" style="flex: 2; padding: 12px; border: none; background: #528FF0; color: white; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;">Pay ₹${(orderData.amount / 100).toFixed(2)}</button>
      </div>
      
      <div style="margin-top: 16px; text-align: center; font-size: 12px; color: #888;">
        🔒 This is a dummy payment for testing purposes
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Handle payment button click
    modal.querySelector('#payNow').onclick = () => {
      // Simulate payment processing
      modal.querySelector('#payNow').innerHTML = 'Processing...';
      modal.querySelector('#payNow').disabled = true;
      
      setTimeout(() => {
        document.body.removeChild(overlay);
        
        // Simulate 90% success rate
        const isSuccess = Math.random() > 0.1;
        
        if (isSuccess) {
          // Generate dummy payment response
          const dummyResponse = {
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: 'pay_' + Math.random().toString(36).substr(2, 14),
            razorpay_signature: 'dummy_signature_' + Date.now()
          };
          
          // Verify payment on backend
          verifyRazorpayPayment({
            orderId: dummyResponse.razorpay_order_id,
            paymentId: dummyResponse.razorpay_payment_id,
            signature: dummyResponse.razorpay_signature
          })
          .then((verificationResult) => {
            if (verificationResult.status === 'success') {
              onSuccess({
                ...dummyResponse,
                verificationResult,
                message: 'Payment completed successfully!'
              });
            } else {
              onFailure(verificationResult.message || 'Payment verification failed');
            }
          })
          .catch((error) => {
            console.error('Payment verification error:', error);
            onFailure('Payment verification failed: ' + error.message);
          });
        } else {
          onFailure('Payment failed: Insufficient funds (dummy failure)');
        }
      }, 2000); // 2 second delay to simulate processing
    };

    // Handle cancel button click
    modal.querySelector('#cancelPayment').onclick = () => {
      document.body.removeChild(overlay);
      onFailure('Payment was cancelled by user');
    };

    // Handle overlay click (close modal)
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
        onFailure('Payment was cancelled by user');
      }
    };
  };

  // Create and show the dummy payment modal
  createDummyPaymentModal();
};

export default {
  createRazorpayOrder,
  verifyRazorpayPayment,
  initiateDummyRazorpayPayment
};
