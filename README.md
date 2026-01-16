# Maker App - Backend API

E-commerce backend API built with Node.js, Express, and MongoDB. Optimized for cPanel deployment.

## 🚀 Features

- **User Authentication**: JWT-based authentication with refresh tokens
- **Google OAuth**: Social login integration
- **Product Management**: CRUD operations for products with image upload
- **Category Management**: Hierarchical categories
- **Shopping Cart**: Full cart functionality
- **Wishlist**: User wishlist management
- **Order Processing**: Complete order management system
- **Image Upload**: Cloudinary integration for product images
- **Multi-language Support**: Ready for i18n integration
- **Algerian Cities**: Built-in support for Algerian locations

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js, JWT
- **Image Storage**: Cloudinary
- **File Upload**: Multer
- **Password Hashing**: Argon2

## 📦 Installation

### Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd maker-app-cpanel

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start development server
npm run dev
```

### Production Deployment (cPanel)

See [CPANEL_DEPLOYMENT.md](CPANEL_DEPLOYMENT.md) for detailed deployment instructions.

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=production
PORT=3001
MONGODB_URL=your_mongodb_connection_string
DATABASE_NAME=your_database_name
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=https://yourdomain.com
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (seller only)
- `PUT /api/products/:id` - Update product (seller only)
- `DELETE /api/products/:id` - Delete product (seller only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/:itemId` - Remove from wishlist

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/addresses` - Get user addresses
- `POST /api/users/addresses` - Add new address

### Cities
- `GET /api/cities` - Get Algerian cities list

## 🗂️ Project Structure

```
maker-app-cpanel/
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── models/            # Mongoose models
├── Routes/            # API routes
├── scripts/           # Utility scripts
├── utils/             # Helper functions
├── logs/              # Application logs
├── .env.example       # Environment variables template
├── .htaccess          # Apache configuration for cPanel
├── .cpanel.yml        # cPanel deployment config
├── ecosystem.config.js # PM2 configuration
├── server.js          # Application entry point
├── index.js           # Express app setup
└── package.json       # Project dependencies
```

## 🔐 Security

- Passwords hashed with Argon2
- JWT tokens with refresh mechanism
- CORS configuration
- Rate limiting (recommended to add)
- Input validation
- Secure session management

## 📝 Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm run prod     # Start production server with NODE_ENV
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For deployment issues, refer to:
- [CPANEL_DEPLOYMENT.md](CPANEL_DEPLOYMENT.md) - Complete deployment guide
- [CATEGORY_SETUP_GUIDE.md](CATEGORY_SETUP_GUIDE.md) - Category management
- [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) - OAuth configuration

## 🔄 Migration from Vercel

This repository is optimized for cPanel but maintains compatibility with Vercel. Key differences:
- Uses `server.js` as entry point instead of serverless functions
- Includes `.htaccess` for Apache/cPanel
- PM2 configuration for process management
- Traditional server startup instead of serverless

---

**Built with ❤️ for Maker DZ**
