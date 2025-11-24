# 💳 Razorpay Payment Integration - Backend Implementation Guide

## 📋 Overview

This guide contains everything your backend team needs to complete the Razorpay payment integration for Nixtour. The frontend is already built and ready - just implement these 2 endpoints and you're done!

---

## ⚡ Quick Summary

**Frontend Status:** ✅ Complete
- Payment UI with Nixtour branding (#BC1110 red)
- Razorpay integration ready
- Dynamic amount handling
- User data pre-filling

**Backend Needed:** 2 Endpoints
1. `POST /api/payment/create-order` - Create Razorpay order
2. `POST /api/payment/verify` - Verify payment signature

**Time to Implement:** ~30 minutes

---

## 🔧 Required Backend Endpoints

### 1️⃣ Create Order Endpoint

**Endpoint:** `POST /api/payment/create-order`

**Purpose:** Creates a secure Razorpay order before payment

**Request Body:**
```json
{
  "amount": 5185,
  "currency": "INR",
  "receipt": "BKG1234567890",
  "notes": {
    "booking_id": "BKG1234567890",
    "customer_id": "user_123",
    "offer_id": "offer_456"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "order_id": "order_xxxxxxxxxxxxx",
  "amount": 518500,
  "currency": "INR"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Error message here"
}
```

**Node.js Implementation:**
```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    // Validate
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount'
      });
    }

    // Create order
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: currency || 'INR',
      receipt: receipt,
      notes: notes || {},
    });

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

---

### 2️⃣ Verify Payment Endpoint

**Endpoint:** `POST /api/payment/verify`

**Purpose:** Verifies payment signature and updates booking

**Request Body:**
```json
{
  "razorpay_payment_id": "pay_xxxxxxxxxxxxx",
  "razorpay_order_id": "order_xxxxxxxxxxxxx",
  "razorpay_signature": "xxxxxxxxxxxxxxxxxxxx",
  "booking_id": "BKG1234567890"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "payment_id": "pay_xxxxxxxxxxxxx",
  "booking_id": "BKG1234567890"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid signature"
}
```

**Node.js Implementation:**
```javascript
const crypto = require('crypto');

app.post('/api/payment/verify', async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      booking_id
    } = req.body;

    // Generate expected signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Verify
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Invalid signature'
      });
    }

    // Update booking status in database
    // await updateBookingStatus(booking_id, 'paid', razorpay_payment_id);

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment_id: razorpay_payment_id,
      booking_id: booking_id,
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

---

## 📦 Installation

```bash
npm install razorpay
```

That's it! Node.js `crypto` module is built-in.

---

## 🔐 Environment Variables

Add to your backend `.env`:

```env
# Razorpay Keys (Get from https://dashboard.razorpay.com/app/keys)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here

# Optional: Webhook secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

⚠️ **NEVER expose `RAZORPAY_KEY_SECRET` to frontend!**

---

## 🔄 Complete Payment Flow

```
1. User clicks "Pay Now" → Frontend
   ↓
2. Frontend → POST /api/payment/create-order
   ↓
3. Backend creates order → Returns order_id
   ↓
4. Frontend opens Razorpay modal with order_id
   ↓
5. User completes payment
   ↓
6. Razorpay returns payment_id + signature
   ↓
7. Frontend → POST /api/payment/verify
   ↓
8. Backend verifies signature
   ↓
9. Backend updates booking → "PAID"
   ↓
10. Frontend shows confirmation
```

---

## 🧪 Testing

### Get Test Keys
1. Go to https://dashboard.razorpay.com/signup
2. Settings → API Keys → Generate Test Keys
3. Copy Key ID and Secret

### Test Cards

**Success:**
```
Card: 4111 1111 1111 1111
Expiry: Any future date (12/25)
CVV: Any 3 digits (123)
Name: Any name
```

**Failure:**
```
Card: 4000 0000 0000 0002
```

### Test UPI
- Success: `success@razorpay`
- Failure: `failure@razorpay`

---

## 🎯 Integration Steps

### Step 1: Install Package
```bash
npm install razorpay
```

### Step 2: Add Environment Variables
```env
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret
```

### Step 3: Copy Endpoint Code
- Copy the `/create-order` endpoint code above
- Copy the `/verify` endpoint code above
- Add to your Express/Node.js app

### Step 4: Test with Frontend
```bash
# Frontend will call your endpoints automatically
# Just make sure your backend is running
```

### Step 5: Update Database
```javascript
// In verify endpoint, after signature verification:
await db.query(
  'UPDATE bookings SET status = ?, payment_id = ? WHERE booking_id = ?',
  ['PAID', razorpay_payment_id, booking_id]
);
```

---

## 🔒 Security Checklist

- [x] `RAZORPAY_KEY_SECRET` only on backend
- [x] Signature verification before marking paid
- [x] Amount validation on backend
- [x] SQL injection prevention
- [ ] Rate limiting on endpoints
- [ ] CORS configuration
- [ ] HTTPS only in production

---

## 🐛 Troubleshooting

### "Invalid signature" Error
- Check `RAZORPAY_KEY_SECRET` is correct
- Ensure signature format: `order_id|payment_id`
- Verify HMAC SHA256 algorithm

### "Order creation failed"
- Check Razorpay key ID is valid
- Verify amount > 0
- Check Razorpay dashboard for errors

### Payment Success but Not Verified
- Check `/verify` endpoint is reachable
- Verify signature logic is correct
- Check database connection

---

## 🚀 Going Live

### Pre-Production Checklist
- [ ] Test all payment methods (Cards, UPI, Wallets)
- [ ] Test payment verification
- [ ] Test database updates
- [ ] Test error scenarios
- [ ] Setup error logging

### Production Deployment
1. Get Live Keys from Razorpay
2. Complete KYC verification
3. Update `RAZORPAY_KEY_ID` to `rzp_live_xxxxx`
4. Update `RAZORPAY_KEY_SECRET`
5. Test with small real amount
6. Deploy!

---

## 📞 Support

**Razorpay Docs:** https://razorpay.com/docs/
**Razorpay Support:** support@razorpay.com
**Dashboard:** https://dashboard.razorpay.com/

---

## 💡 Optional: Webhooks (Recommended)

Add this for automatic payment notifications:

```javascript
app.post('/api/payment/webhook', async (req, res) => {
  try {
    // Verify webhook signature
    const signature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;
    const payload = req.body.payload;

    // Handle events
    switch (event) {
      case 'payment.captured':
        // Payment successful
        console.log('Payment captured:', payload.payment.entity);
        break;

      case 'payment.failed':
        // Payment failed
        console.log('Payment failed:', payload.payment.entity);
        break;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

Configure in Razorpay Dashboard:
1. Settings → Webhooks
2. Add URL: `https://yourdomain.com/api/payment/webhook`
3. Select events: `payment.captured`, `payment.failed`

---

## ✅ Summary

**What Frontend Has:**
- ✅ Payment UI with Razorpay integration
- ✅ Nixtour branding (#BC1110)
- ✅ Dynamic amount handling
- ✅ Error handling
- ✅ Success/failure flows

**What Backend Needs:**
- ⏳ `/api/payment/create-order` endpoint
- ⏳ `/api/payment/verify` endpoint
- ⏳ Database update logic
- ⏳ Environment variables

**Estimated Time:** 30-60 minutes

**Complexity:** Low - just 2 simple endpoints!

---

## 🎉 That's It!

Copy the code, add your keys, deploy, and your payment system is live! The frontend team has done all the heavy lifting - you just need these 2 endpoints.

Questions? Check Razorpay docs or contact support.

**Happy Coding! 🚀**