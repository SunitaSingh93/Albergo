// Receipt generation utility for hotel booking and payment
export const generateBookingReceipt = (paymentDetails, bookingDetails, orderData, customerInfo) => {
  const receiptData = {
    receiptNumber: `REC-${Date.now()}`,
    date: new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    ...paymentDetails,
    ...bookingDetails,
    ...orderData,
    customerInfo
  };

  // Generate HTML receipt content
  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Hotel Booking Receipt</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background: #f5f5f5;
          color: #333;
        }
        .receipt-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .receipt-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .receipt-header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: 600;
        }
        .receipt-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .receipt-body {
          padding: 30px;
        }
        .receipt-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }
        .info-section h3 {
          margin: 0 0 15px 0;
          color: #667eea;
          font-size: 18px;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 8px;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding: 8px 0;
          border-bottom: 1px solid #f8f8f8;
        }
        .info-item:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 500;
          color: #666;
        }
        .info-value {
          font-weight: 600;
          color: #333;
        }
        .payment-summary {
          background: #f8f9ff;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #667eea;
        }
        .payment-summary h3 {
          margin: 0 0 15px 0;
          color: #667eea;
          font-size: 18px;
        }
        .total-amount {
          font-size: 24px;
          font-weight: bold;
          color: #2d5a27;
          text-align: center;
          margin: 20px 0;
          padding: 15px;
          background: #e8f5e8;
          border-radius: 8px;
        }
        .receipt-footer {
          background: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          border-top: 1px solid #e9ecef;
        }
        .receipt-footer p {
          margin: 5px 0;
          color: #666;
          font-size: 14px;
        }
        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .status-confirmed {
          background: #d4edda;
          color: #155724;
        }
        .status-paid {
          background: #cce5ff;
          color: #004085;
        }
        @media print {
          body { background: white; }
          .receipt-container { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="receipt-header">
          <h1>🏨 Hotel Management System</h1>
          <p>Booking & Payment Receipt</p>
        </div>
        
        <div class="receipt-body">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0; color: #333;">Receipt #${receiptData.receiptNumber}</h2>
            <p style="margin: 5px 0 0 0; color: #666;">${receiptData.date}</p>
          </div>
          
          <div class="receipt-info">
            <div class="info-section">
              <h3>🏨 Booking Details</h3>
              <div class="info-item">
                <span class="info-label">Room Number:</span>
                <span class="info-value">Room ${receiptData.roomId}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Check-in Date:</span>
                <span class="info-value">${new Date(receiptData.checkInDate).toLocaleDateString('en-IN')}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Check-out Date:</span>
                <span class="info-value">${new Date(receiptData.checkOutDate).toLocaleDateString('en-IN')}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Guests:</span>
                <span class="info-value">${receiptData.guestCount || receiptData.guests} Guest(s)</span>
              </div>
              <div class="info-item">
                <span class="info-label">Status:</span>
                <span class="info-value"><span class="status-badge status-confirmed">Confirmed</span></span>
              </div>
            </div>
            
            <div class="info-section">
              <h3>👤 Customer Details</h3>
              <div class="info-item">
                <span class="info-label">Name:</span>
                <span class="info-value">${receiptData.customerInfo?.firstName || 'Customer'} ${receiptData.customerInfo?.lastName || ''}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">${receiptData.customerInfo?.email || 'customer@hotel.com'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Phone:</span>
                <span class="info-value">${receiptData.customerInfo?.phone || 'N/A'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Customer ID:</span>
                <span class="info-value">${receiptData.customerInfo?.userId || receiptData.userId}</span>
              </div>
            </div>
          </div>
          
          <div class="payment-summary">
            <h3>💳 Payment Information</h3>
            <div class="info-item">
              <span class="info-label">Payment ID:</span>
              <span class="info-value">${receiptData.paymentId || receiptData.razorpay_payment_id}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Order ID:</span>
              <span class="info-value">${receiptData.orderId || receiptData.razorpay_order_id}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Payment Method:</span>
              <span class="info-value">Razorpay (Card Payment)</span>
            </div>
            <div class="info-item">
              <span class="info-label">Transaction Status:</span>
              <span class="info-value"><span class="status-badge status-paid">Paid</span></span>
            </div>
          </div>
          
          <div class="total-amount">
            Total Amount Paid: ₹${(receiptData.amount / 100).toFixed(2)}
          </div>
          
          ${receiptData.specialRequests ? `
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #856404;">📝 Special Requests:</h4>
            <p style="margin: 0; color: #856404;">${receiptData.specialRequests}</p>
          </div>
          ` : ''}
        </div>
        
        <div class="receipt-footer">
          <p><strong>Thank you for choosing Hotel Management System!</strong></p>
          <p>For any queries, please contact us at support@hotel.com</p>
          <p>This is a computer-generated receipt and does not require a signature.</p>
          <p style="font-size: 12px; margin-top: 15px; color: #999;">
            Generated on ${new Date().toLocaleString('en-IN')} | Receipt #${receiptData.receiptNumber}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { receiptHTML, receiptData };
};

// Download receipt as HTML file
export const downloadReceipt = (receiptHTML, receiptData) => {
  const blob = new Blob([receiptHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Hotel_Receipt_${receiptData.receiptNumber}_${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Print receipt
export const printReceipt = (receiptHTML) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(receiptHTML);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};

export default {
  generateBookingReceipt,
  downloadReceipt,
  printReceipt
};
