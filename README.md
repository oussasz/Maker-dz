# Maker DZ - cPanel Deployment

Algerian handcraft marketplace - Node.js backend + React frontend

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

1. Build: `cd frontend && npm run build:cpanel`
2. Upload files

### Environment Variables

all are set in the node js app in C-panel

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/products` - List products
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/categories` - List categories
- `GET /api/cart` - Get cart
- `GET /api/wishlist` - Get wishlist
