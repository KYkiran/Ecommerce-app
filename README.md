# E-commerce Platform

A full-stack e-commerce web application built with React, Node.js, Express, and MongoDB. Features user authentication, product management, shopping cart, payment processing with Stripe, and admin analytics.

## 🚀 Features

### User Features
- **Authentication**: Sign up, login, logout with JWT tokens
- **Product Browsing**: View all products, featured products, and filter by category
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout**: Secure payment processing with Stripe
- **Coupons**: Apply discount coupons during checkout
- **Recommendations**: Get personalized product recommendations

### Admin Features
- **Product Management**: Create, delete, and toggle featured products
- **Analytics Dashboard**: View sales data and user statistics
- **User Management**: Admin-only routes and permissions

### Technical Features
- **Caching**: Redis integration for improved performance
- **File Upload**: Cloudinary integration for image storage
- **Real-time Updates**: Optimistic UI updates
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **State Management**: Zustand for client-side state

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **React Hot Toast** - Toast notifications
- **Recharts** - Data visualization
- **Stripe.js** - Payment processing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Redis** - Caching and session storage
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Stripe** - Payment processing
- **Cloudinary** - Image storage and management

## 📁 Project Structure

```
├── backend/
│   ├── controllers/        # Route handlers
│   │   ├── analytics.controller.js
│   │   ├── auth.controller.js
│   │   ├── cart.controller.js
│   │   ├── coupon.controller.js
│   │   ├── payment.controller.js
│   │   └── product.controller.js
│   ├── middlewares/        # Custom middleware
│   │   └── auth.middleware.js
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   │   ├── analytics.route.js
│   │   ├── auth.route.js
│   │   ├── cart.route.js
│   │   ├── coupon.route.js
│   │   ├── payment.route.js
│   │   └── product.route.js
│   └── server.js          # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── stores/        # Zustand stores
│   │   ├── lib/           # Utility functions
│   │   └── App.jsx        # Main app component
│   └── package.json
└── package.json           # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Redis server
- Stripe account
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-3
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   
   # Redis
   REDIS_URL=redis://localhost:6379
   
   # Stripe
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Environment
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```

5. **Start the development servers**
   
   Backend:
   ```bash
   npm run dev
   ```
   
   Frontend (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

The backend will run on `http://localhost:5000` and the frontend on `http://localhost:5173`.

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products (Admin only)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/recommendations` - Get recommended products
- `POST /api/products` - Create product (Admin only)
- `PATCH /api/products/:id` - Toggle featured status (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update item quantity
- `DELETE /api/cart` - Clear cart

### Payment
- `POST /api/payments/create-checkout-session` - Create Stripe checkout session
- `POST /api/payments/checkout-success` - Handle successful payment

### Coupons
- `GET /api/coupons` - Get available coupons
- `POST /api/coupons/validate` - Validate coupon code

### Analytics
- `GET /api/analytics` - Get sales analytics (Admin only)

## 🔧 Configuration

### Database Setup
Make sure MongoDB is running and create a database named `ecommerce` or update the `MONGODB_URI` in your `.env` file.

### Redis Setup
Use Upstash for setting up Redis https://upstash.com/.

### Stripe Setup
1. Create a Stripe account in https://stripe.com/in
2. Get your secret key from the Stripe dashboard
3. Set up webhook endpoints for handling payment events

### Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Configure the credentials in your `.env` file

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Ensure MongoDB and Redis are accessible
3. Deploy using your preferred platform (Heroku, Vercel, etc.)

### Frontend Deployment
1. Build the production version:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `dist` folder to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🐛 Known Issues

- Ensure all environment variables are properly configured
- Redis connection required for caching features
- Stripe webhook configuration needed for payment processing

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.
