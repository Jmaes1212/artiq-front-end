# Artiq Prints - Stripe & Prodigi Integration

A complete print-on-demand e-commerce solution with Stripe payments and Prodigi order fulfillment.

## Features

- **Product Catalog**: Curated artwork with multiple sizes and frame options
- **Shopping Cart**: Add/remove items, quantity management, persistent storage
- **Checkout Process**: Customer information, shipping details, order summary
- **Stripe Payments**: Secure card payments using Stripe Payment Intents
- **Prodigi Integration**: Automatic order submission to Prodigi for fulfillment
- **Order Tracking**: Webhook support for order status updates
- **Responsive Design**: Modern UI that works on all devices

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Prodigi API

1. Copy the environment template:
   ```bash
   cp ../env-template.txt .env
   ```

2. Edit `.env` and add your Prodigi credentials:
   ```
   PRODIGI_API_KEY=your_actual_api_key_here
   PRODIGI_API_BASE=https://api.sandbox.prodigi.com/v4.0
   PRODIGI_WEBHOOK_SECRET=your_webhook_secret_here
   PORT=4000
   ```

3. Get your Prodigi API key from: https://prodigi.com/developers/

### 3. Configure Stripe

1. In the same `.env` file, add your Stripe keys:
   ```
   STRIPE_SECRET_KEY=sk_test_xxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxx
   ```
2. You can create and manage Stripe API keys at https://dashboard.stripe.com/apikeys

### 4. Start the Server

```bash
npm start
```

The server will start on http://localhost:4000

### 5. Configure Prodigi SKUs

Edit `assets/js/data.js` to update the `prodigiSkus` for each product. Each product needs SKUs mapped to:
- Size options (A4, A3, A2, A1, 40x40cm, 60x60cm)
- Frame options (natural, black, white, walnut, gold, silver)

Example:
```javascript
prodigiSkus: {
  "A4 (21 x 29.7 cm)": {
    natural: "product-name-a4-natural",
    black: "product-name-a4-black",
    // ... other frames
  },
  // ... other sizes
}
```

### 6. Update Asset URLs

Replace the placeholder asset URLs in `assets/js/data.js` with actual artwork URLs:
```javascript
assetUrl: "https://your-domain.com/artwork/product-name.jpg"
```

## How It Works

### Order Flow

1. **Product Selection**: Customer selects artwork, size, and frame
2. **Add to Cart**: Item added to shopping cart with calculated pricing
3. **Checkout**: Customer submits shipping details and card information
4. **Payment Authorization**: Stripe confirms the card payment and returns a Payment Intent ID
5. **Prodigi Order Submission**: Order sent to Prodigi API for fulfillment
6. **Confirmation**: Customer receives order confirmation with tracking
7. **Webhook Updates**: Prodigi sends status updates via webhooks

### Stripe Integration

The storefront uses Stripe.js on the client and the Payment Intents API on the server to:
- Fetch the publishable key dynamically via `GET /api/stripe/config`
- Create payment intents server-side with `/api/payments/create-intent`
- Confirm card details securely in the browser using Stripe Elements
- Verify that the Payment Intent succeeded before submitting the Prodigi order

### Prodigi Integration

The system integrates with Prodigi's API to:
- Submit orders with customer and shipping information
- Include artwork URLs and product SKUs
- Handle order status updates via webhooks
- Track order progress from submission to delivery

### Cart Management

- Items persist in localStorage
- Quantity adjustments
- Price calculations based on size multipliers
- Real-time total updates

## API Endpoints

- `GET /api/stripe/config` - Retrieve the Stripe publishable key for the frontend
- `POST /api/payments/create-intent` - Create a Stripe Payment Intent for the basket total
- `POST /api/checkout` - Submit order to Prodigi
- `POST /api/webhooks/prodigi` - Receive Prodigi webhook updates
- `GET /api/orders/:id` - Get order status
- `GET /api/health` - Health check

## File Structure

```
Artiq/
├── assets/
│   ├── css/styles.css          # Main stylesheet
│   └── js/
│       ├── data.js             # Product data and Prodigi SKUs
│       ├── cart.js             # Shopping cart functionality
│       ├── product.js          # Product page logic
│       ├── main.js             # Homepage logic
│       ├── components.js       # UI components
│       └── utils.js            # Utility functions
├── server/
│   ├── src/
│   │   ├── index.js            # Express server
│   │   ├── prodigi.js          # Prodigi API integration
│   │   └── orders.js           # Order management
│   └── package.json            # Server dependencies
├── index.html                  # Homepage
├── product.html               # Product page
└── env-template.txt           # Environment configuration template
```

## Testing

1. Use Prodigi sandbox environment for testing
2. Test the complete order flow:
   - Add items to cart
   - Proceed to checkout
   - Submit order
   - Verify Prodigi receives the order

## Production Deployment

1. Update `PRODIGI_API_BASE` to production URL
2. Configure webhook endpoint in Prodigi dashboard
3. Update asset URLs to production CDN
4. Set up proper error handling and logging
5. Configure SSL certificates

## Support

For issues with:
- **Prodigi API**: Check Prodigi documentation and support
- **This Application**: Review the code and configuration
- **Setup Issues**: Verify environment variables and dependencies
