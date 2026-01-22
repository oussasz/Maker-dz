# Maker DZ - cPanel Deployment

Algerian handcraft marketplace - Node.js backend + React frontend for cPanel hosting.

## Project Structure

```
maker-app-cpanel/
├── app.js                    # Main entry point (Passenger compatible)
├── .htaccess                 # Passenger configuration
├── package.json              # Backend dependencies
│
├── config/
│   ├── database.js           # MySQL connection
│   └── schema.sql            # Database tables
│
├── controllers/mysql/        # Route handlers (MySQL)
├── Routes/mysql/             # API routes (MySQL)
├── models/mysql/             # Database models (MySQL)
├── middleware/mysql/         # Auth middleware (MySQL)
│
├── utils/
│   ├── algeria_cities.json   # City data
│   └── dataloader.js         # Helper utilities
│
└── frontend/                 # React frontend (Vite)
    ├── src/                  # Source code
    ├── public/               # Static assets (images, locales)
    └── dist/                 # BUILD OUTPUT → Deploy to public_html
```

## Deployment to cPanel

### Backend (Node.js App)

Upload these to your cPanel Node.js app folder (e.g., `/home/username/Maker-dz/`):

- `app.js`
- `.htaccess`
- `package.json`
- `config/`
- `controllers/`
- `Routes/`
- `models/`
- `middleware/`
- `utils/`

### Frontend (Static Files)

1. Build: `cd frontend && npm run build`
2. Upload `frontend/dist/*` contents to `public_html/`

### Environment Variables

```
DB_HOST=localhost
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/products` - List products
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/categories` - List categories
- `GET /api/cart` - Get cart
- `GET /api/wishlist` - Get wishlist
