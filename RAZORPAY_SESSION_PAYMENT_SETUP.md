# Razorpay Session Payment Gateway Setup

## Overview

This document outlines the setup for the new dedicated Razorpay session payment gateway used exclusively for the **Pricing Page** ($25 sessions). This is separate from the Demo booking payment ($0.54).

## Payment Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Pricing Page Sessions                       │
├─────────────────────────────────────────────────────────────┤
│ User clicks "Get Started" → Enrollment Form                 │
│ → initiateSessionEnrollmentPayment()                        │
│ → /api/razorpay/create-session-order (NEW endpoint)        │
│ → Razorpay Checkout with SESSION_KEY_ID                    │
│ → Payment Success → Sync to Google Sheets                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Demo Booking                              │
├─────────────────────────────────────────────────────────────┤
│ User clicks "Book Demo" → Demo Form                         │
│ → initiateDemo1DollarPayment()                              │
│ → /api/razorpay/create-order (existing endpoint)           │
│ → Razorpay Checkout with KEY_ID                            │
│ → Payment Success → Sync to Google Sheets                  │
└─────────────────────────────────────────────────────────────┘
```

## Environment Variables

### Frontend Environment Variables (.env or .env.local)

```env
# Demo Payment Gateway (Existing - $0.54 demo)
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx  # Demo Razorpay Key

# Session Payment Gateway (New - $25 sessions pricing page)
VITE_RAZORPAY_SESSION_KEY_ID=rzp_test_yyyyyyyyyy  # Session Razorpay Key
```

### Backend Environment Variables (Backend .env / Cloudflare Workers)

```env
# Demo Payment Gateway (Existing)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=whsec_xxxxxxxxxxxxxxxx

# Session Payment Gateway (New - Dedicated)
RAZORPAY_SESSION_KEY_ID=rzp_live_yyyyyyyyyy  # Production Session Key
RAZORPAY_SESSION_KEY_SECRET=whsec_yyyyyyyyyy  # Session Key Secret
```

## Current Implementation Details

### Files Modified/Created

1. **New API Endpoint**: [src/pages/api/razorpay/create-session-order.ts](src/pages/api/razorpay/create-session-order.ts)
   - Handles session order creation for pricing page
   - Uses `RAZORPAY_SESSION_KEY_ID` and `RAZORPAY_SESSION_KEY_SECRET`
   - Fallback to standard keys if session keys not provided
   - Always returns USD currency (not INR)
   - Includes plan name and billing mode in notes

2. **Updated Service**: [src/services/razorpayService.ts](src/services/razorpayService.ts)
   - Added `SESSION_KEY_ID` constant for session payments
   - Added `createSessionOrder()` method for session order creation
   - Added `initiateSessionEnrollmentPayment()` method for session checkout
   - Separate from existing `initiatePlanPayment()` method

3. **Updated Component**: [src/components/pages/ProgramFeesPage.tsx](src/components/pages/ProgramFeesPage.tsx)
   - Updated `handlePlanCheckout()` to use `initiateSessionEnrollmentPayment()`
   - Previously used `initiatePlanPayment()`

## Payment Details

### Session Payment (Pricing Page)
- **Amount**: $20-30 per session (configurable per plan)
- **Currency**: USD (always, regardless of user location)
- **Payment Methods**: Credit/Debit Cards, International payments
- **Recording**: All payments logged with `payment_type: 'session_enrollment'`

### Demo Payment (Existing)
- **Amount**: $0.54 USD / ₹49.00 INR
- **Currency**: Adaptive (INR for India, USD for others)
- **Payment Methods**: UPI for India, Cards for others
- **Recording**: All payments logged with `payment_type: 'demo'` (implicit)

## Razorpay API Key Configuration

### Step 1: Create Session Payment Key ID (Production)

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to **Settings** → **API Keys**
3. Create a new API key if needed or use existing
4. Copy the **Key ID** (starts with `rzp_live_`)
5. Copy the **Key Secret** (keep secure)

### Step 2: Configure Environment Variables

#### For Local Development:
Create/update `.env.local`:
```env
VITE_RAZORPAY_SESSION_KEY_ID=rzp_test_xxxxxxxxxx
```

#### For Backend (Astro/Node.js):
Update your `.env` or deployment secret manager:
```env
RAZORPAY_SESSION_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_SESSION_KEY_SECRET=whsec_xxxxxxxxxxxxxxxx
```

#### For Cloudflare (if using Cloudflare Workers):
```bash
wrangler secret put RAZORPAY_SESSION_KEY_ID
wrangler secret put RAZORPAY_SESSION_KEY_SECRET
```

### Step 3: Testing

1. Use **Razorpay Test Keys** for development (start with `rzp_test_`)
2. Test transaction: Use card `4111 1111 1111 1111` with any future expiry and CVC
3. Once tested, switch to **Production Keys** (start with `rzp_live_`)

## Webhook Configuration (Optional)

If you want to listen to session payment webhooks:

1. Go to **Settings** → **Webhooks** in Razorpay Dashboard
2. Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select events:
   - `payment.authorized`
   - `payment.failed`
   - `payment.captured`
4. System will automatically sync confirmed payments to Google Sheets

## Troubleshooting

### Issue: "Missing VITE_RAZORPAY_SESSION_KEY_ID"
**Solution**: Make sure the environment variable is set before running the application. Restart your dev server after adding it.

### Issue: Session payments still going to demo gateway
**Solution**: Verify you're using `initiateSessionEnrollmentPayment()` in ProgramFeesPage. Check the network tab to confirm `/api/razorpay/create-session-order` is being called (not `/api/razorpay/create-order`).

### Issue: "Razorpay server credentials are missing" (Backend error)
**Solution**: 
- Ensure `RAZORPAY_SESSION_KEY_ID` and `RAZORPAY_SESSION_KEY_SECRET` are set in backend environment
- Check that Cloudflare environment variables are properly configured if deployed

## Next Steps

1. **Get your Razorpay Keys**:
   - Test Key ID: Request from your Razorpay Account Manager
   - Live Key ID: Available after KYC verification

2. **Configure Environment**:
   - Add the keys to your `.env.local` (frontend) and backend env

3. **Test the Integration**:
   - Try paying on pricing page with test card
   - Verify payment appears in Razorpay Dashboard
   - Check Google Sheets for payment sync

4. **Deploy to Production**:
   - Use `rzp_live_*` keys in production environment
   - Monitor first few transactions in Razorpay Dashboard

## Support

For Razorpay-specific issues:
- Email: support@razorpay.com
- Dashboard: https://dashboard.razorpay.com
- Documentation: https://razorpay.com/docs/
