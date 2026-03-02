# Payment Integration - PubliShelf

## Overview
Implemented Stripe payment integration for PubliShelf with two payment methods:
1. **Cash on Delivery (COD)** - Direct order placement
2. **Online Payment** - Stripe checkout session for secure card payments

## Changes Made

### Backend

#### 1. Order Model (`server/models/Order.model.js`)
Added Stripe-related fields:
- `paymentMethod`: Changed enum to `["COD", "ONLINE"]`
- `paymentProvider`: `["stripe", "cod"]`
- `stripeCheckoutSessionId`: Store Stripe session ID
- `stripePaymentIntentId`: Store payment intent ID
- `idempotencyKey`: Prevent duplicate charges
- `statusHistory`: Track order status changes with timestamps

#### 2. Stripe Service (`server/services/stripe.services.js`)
Core payment logic:
- `createStripeCheckoutSession`: Initialize Stripe checkout with order details
- `handleStripeWebhook`: Process Stripe webhook events (payment success/failure)
- `getStripeSessionAndOrder`: Retrieve session details
- `refundOrder`: Handle refunds (admin only)
- Includes idempotency key handling to prevent duplicate charges
- Automatic stock restoration on payment failure

#### 3. Payment Routes (`server/routes/payment.routes.js`)
New endpoints:
- `POST /api/payments/stripe/create-checkout-session`: Create Stripe session
- `GET /api/payments/stripe/session/:id`: Get session details

#### 4. Buyer Controller & Service Updates
- `buyer.controller.js`: Added `createCheckoutSession` controller
- `buyer.services.js`: 
  - Updated `placeOrder` for COD only
  - Added `prepareCheckoutData` to prepare order without placing it
- `buyer.routes.js`: Added `/checkout/create-session` endpoint

#### 5. Server Configuration (`server/server.js`)
- Added webhook endpoint before JSON parsing: `/api/webhooks/stripe`
- Imported payment routes: `/api/payments`
- Webhook validates Stripe signature and updates order status

### Frontend

#### 1. Checkout Page (`client/src/pages/buyer/checkout/Checkout.jsx`)
Simplified payment options:
- Removed card and UPI forms
- Two radio buttons: COD and Online Payment
- For COD: Direct order placement via existing API
- For Online Payment: Redirect to Stripe checkout
- Added proper loading states and error handling

#### 2. Payment Success Page (`client/src/pages/buyer/PaymentSuccess.jsx`)
New page to verify and display payment results:
- Verifies payment with backend using session ID
- Displays order details and delivery address
- Clears cart after successful payment
- Error handling for failed payments

#### 3. Routes (`client/src/routes/ProtectedRoutes.jsx`)
Added payment success route: `/buyer/payment-success`

### Environment Variables

#### Server (`.env.example`)
```
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Payment Flow

### Cash on Delivery (COD)
1. User selects COD and confirms order
2. Frontend calls `/api/buyer/checkout/place-order`
3. Order created with status "created" and payment status "pending"
4. Stock deducted immediately
5. Cart cleared
6. User redirected to cart page with success message

### Online Payment (Stripe)
1. User selects Online Payment and confirms order
2. Frontend calls `/api/buyer/checkout/create-session`
3. Backend creates pending order and Stripe session
4. User redirected to Stripe checkout page
5. User completes payment on Stripe
6. Stripe webhook notifies backend:
   - Success: Order status updated to "paid"
   - Failure: Order status updated to "failed", stock restored
7. User redirected to success page with order details

## Security Features

1. **Idempotency Keys**: Prevent duplicate charges
2. **Webhook Verification**: Stripe signature validation
3. **Stock Management**: Atomic transactions with MongoDB sessions
4. **Backend Validation**: All prices calculated server-side
5. **Auth Protection**: All endpoints require authentication

## Testing

### Stripe Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date and 3-digit CVC

### Webhook Testing
Use Stripe CLI to forward webhooks to local development:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Setup Instructions

1. Get Stripe API keys from [Stripe Dashboard](https://dashboard.stripe.com)
2. Add keys to server `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
3. Configure webhook endpoint in Stripe Dashboard:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `checkout.session.expired`
4. Install Stripe package (already in package.json):
   ```
   npm install stripe
   ```

## Notes

- Orders are created when user clicks "Place Order", not after payment
- Stock is deducted immediately for both COD and Online payment
- Failed online payments trigger automatic stock restoration
- Webhook events are the source of truth for payment status
- Frontend success page only displays information, backend controls order state
