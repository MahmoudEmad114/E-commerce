# E-Commerce Product & Order API

A RESTful API for an E-Commerce platform built with Node.js, Express.js, and MongoDB.

The API provides authentication, product management, order management, role-based authorization, and an AI-powered product description generator using Google Gemini.

## Features

### Authentication & Users

- User registration
- User login
- User logout
- Get current authenticated user
- JWT authentication
- Password hashing
- Role-based authorization
- Admin user management

### Products

- Create products
- Get all products
- Get product by ID
- Update products
- Delete products
- Product stock management
- Product validation

### Customer Orders

- Create orders
- View customer's orders
- View a specific order
- Cancel eligible orders
- Automatic stock deduction
- Automatic order total calculation
- Order ownership validation

### Admin Orders

- View all orders
- View specific orders
- Update order status
- Manage order lifecycle

### Order Status

Orders can have the following statuses:

- `Pending`
- `Confirmed`
- `Shipped`
- `Delivered`
- `Cancelled`

### AI Product Description

The API includes an AI feature powered by Google Gemini.

It generates a short product description based on:

- Product name
- Product category
- Additional product information

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- express-validator
- Google Gemini API
- Swagger / OpenAPI
- Postman
- Nodemon

## Project Structure

```text
E-Co Project/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   ├── orderController.js
|   ├── errorController.js
│   └── aiController.js
│
├── middleware/
│   ├── auth.js
│   └── validators.js
│
├── models/
│   ├── userModel.js
│   ├── productModel.js
│   └── orderModel.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── aiRoutes.js
│
├── utils/
│   ├── appError.js
│   └── catchAsync.js
│
├── swagger/
│   └── swagger.js
│
├── app.js
├── server.js
├── package.json
├── package-lock.json
├── .env.example
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the project

```bash
cd E-Co-Project
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create environment variables

Create a `.env` file in the root directory.

Use `.env.example` as a template:

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d

GEMINI_API_KEY=your_gemini_api_key
```

### 5. Run the application

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

The API will run on:

```text
http://localhost:8000
```

## API Base URL

```text
http://localhost:8000/api/v1
```

## Authentication

The API uses JWT authentication.

After login, the authenticated user receives a JWT token.

Protected endpoints require authentication.

Example:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Main Endpoints

### Authentication

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | `/auth/register` | Register a new customer |
| POST   | `/auth/login`    | Login                   |
| POST   | `/auth/logout`   | Logout                  |
| GET    | `/auth/me`       | Get current user        |

### Products

| Method | Endpoint        | Access |
| ------ | --------------- | ------ |
| GET    | `/products`     | Public |
| GET    | `/products/:id` | Public |
| POST   | `/products`     | Admin  |
| PATCH  | `/products/:id` | Admin  |
| DELETE | `/products/:id` | Admin  |

### Customer Orders

| Method | Endpoint             | Access           |
| ------ | -------------------- | ---------------- |
| POST   | `/orders`            | Customer         |
| GET    | `/orders/my-orders`  | Customer         |
| GET    | `/orders/:id`        | Customer / Admin |
| PATCH  | `/orders/:id/cancel` | Customer         |

### Admin Orders

| Method | Endpoint             | Access |
| ------ | -------------------- | ------ |
| GET    | `/orders`            | Admin  |
| PATCH  | `/orders/:id/status` | Admin  |

### AI

| Method | Endpoint                           | Access             |
| ------ | ---------------------------------- | ------------------ |
| POST   | `/ai/generate-product-description` | Authenticated User |

## Create Order Example

Request:

```http
POST /api/v1/orders
```

Body:

```json
{
  "items": [
    {
      "product": "PRODUCT_ID",
      "quantity": 2
    }
  ]
}
```

The API automatically:

- Validates the product
- Checks stock
- Calculates the total price
- Deducts the quantity from stock
- Creates the order with `Pending` status

## Generate Product Description

Request:

```http
POST /api/v1/ai/generate-product-description
```

Body:

```json
{
  "name": "Wireless Headphones",
  "category": "Electronics",
  "info": "Bluetooth headphones with noise cancellation and 30 hours battery life"
}
```

Example response:

```json
{
  "status": "success",
  "message": "Description generated successfully",
  "data": {
    "name": "Wireless Headphones",
    "category": "Electronics",
    "description": "Enjoy immersive sound with advanced noise cancellation and up to 30 hours of battery life."
  }
}
```

## Swagger Documentation

Swagger/OpenAPI documentation is available through the Swagger UI.

After starting the server, open:

```text
http://localhost:8000/api-docs
```

Use Swagger UI to:

- Explore endpoints
- View request/response schemas
- Test API endpoints
- Authorize protected endpoints using JWT

## Postman

A Postman collection is included with the project.

The collection contains requests for:

- Authentication
- Users
- Products
- Customer Orders
- Admin Orders
- AI Product Description

Before testing protected endpoints, login and provide the JWT token in the Authorization header.

## Environment Variables

| Variable         | Description                    |
| ---------------- | ------------------------------ |
| `PORT`           | Server port                    |
| `MONGODB_URI`    | MongoDB connection string      |
| `JWT_SECRET`     | Secret used to sign JWT tokens |
| `JWT_EXPIRES_IN` | JWT expiration time            |
| `GEMINI_API_KEY` | Google Gemini API key          |

## Error Handling

The API provides centralized error handling for common cases such as:

- Invalid input
- Invalid MongoDB IDs
- Authentication errors
- Authorization errors
- Invalid credentials
- Missing products
- Insufficient stock
- Invalid order status
- Invalid order ownership
- Gemini API errors

## Git Collaboration

The project was developed using Git and GitHub collaboration.

Recommended workflow:

```bash
git checkout -b feature/feature-name

git add .

git commit -m "Add feature"

git push origin feature/feature-name
```

Then create a Pull Request on GitHub.

## License

This project was developed as a team training/educational project.
