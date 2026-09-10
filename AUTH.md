# Authentication Module

JWT-based authentication for the E-commerce API.

## Packages Installed

| Package | Purpose |
| --- | --- |
| `bcryptjs` | Password hashing (pure JS, no native build tools) |
| `jsonwebtoken` | JWT signing and verification |
| `express-validator` | Request body validation |
| `cookie-parser` | Parse the JWT HTTP-only cookie |
| `swagger-ui-express` | Serves the Swagger UI at `/api-docs` |
| `swagger-jsdoc` | Generates the OpenAPI spec from JSDoc `@openapi` annotations |

Install all required dependencies with:

```bash
npm install bcryptjs jsonwebtoken express-validator cookie-parser swagger-ui-express swagger-jsdoc
```

## Environment Variables

```env
NODE_ENV=development
PORT=8000
MONGO_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>/<DB>?retryWrites=true&w=majority
JWT_SECRET=super-secret-key-change-me
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

## Endpoints

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/v1/users/signup` | Register a new user | Public |
| `POST` | `/api/v1/users/login` | Log in and receive a JWT cookie | Public |
| `POST` | `/api/v1/users/logout` | Clear the JWT cookie | Public |

### Example: Signup

```http
POST /api/v1/users/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response `201`:

```json
{
  "status": "success",
  "token": "<jwt>",
  "data": {
    "user": {
      "_id": "6aa3393e94cb35fed77757ed",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "createdAt": "2026-09-10T23:11:58.340Z",
      "updatedAt": "2026-09-10T23:11:58.340Z"
    }
  }
}
```

### Example: Login

```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response `200`: same shape as signup plus a `jwt` HTTP-only cookie is set.
Wrong credentials return `401 Incorrect email or password`.

## Files Changed / Created

### `models/userModel.js`
- Fixed email validator typo (`validator:` -> `validate:`)
- `password` field set to `select: false` (never returned by default)
- Added `passwordChangedAt` field for token invalidation on password change
- `pre('save')` hook hashes the password with `bcryptjs` (12 rounds) whenever the password is modified
- Instance method `correctPassword(candidate, hash)` compares a plain password with the stored hash
- Instance method `changedPasswordAfter(jwtTimestamp)` detects tokens issued before a password change
- Mongoose 9 compatible: pre-save hooks no longer receive/use `next()`

### `controllers/authController.js` (new)
- `signToken(id)` signs a JWT with `JWT_SECRET` and `JWT_EXPIRES_IN`
- `createSendToken(user, statusCode, res)` signs the token, sets an HTTP-only `jwt` cookie
  (adds `secure` flag in production), strips the password, and sends the response
- `signup` creates the user and returns a token
- `login` looks up the user by email with `+password`, verifies with `correctPassword`,
  and returns `401 Incorrect email or password` on failure
- `logout` clears the cookie
- All async handlers wrapped with the existing `utils/catchAsync`

### `middleware/authMiddleware.js` (new)
- `protect` reads the token from the `jwt` cookie (or `Authorization: Bearer <token>`),
  verifies it, loads the user, and rejects users who changed their password after the token was issued;
  sets `req.user`
- `restrictTo(...roles)` rejects requests unless `req.user.role` is in the allowed roles (403)

### `routes/authRoutes.js` (new)
- `POST /signup`, `POST /login`, `POST /logout`
- Express-validator rules per route: name length >= 2, valid email, password length >= 8
- `validate` middleware formats `validationResult` errors into a `400 AppError` that flows
  through the global error controller
- JSDoc `@openapi` annotations for each endpoint under the `auth` tag

### `app.js`
- Added `cookieParser()`
- Mounted the auth router at `/api/v1/users`
- Mounted Swagger UI at `/api-docs`

## Swagger

Docs are served at:

```
http://localhost:8000/api-docs
```

Spec details:
- Tag: `auth`
- Each endpoint has an operation `summary` and `description`
- Request/response schemas with field examples: `SignupInput`, `LoginInput`, `User`
- Security schemes: `bearerAuth` (Authorization header) and `cookieAuth` (jwt cookie)

## Protected Route Usage

```js
const authMiddleware = require('./middleware/authMiddleware');

router.get('/me', authMiddleware.protect, authMiddleware.restrictTo('customer', 'admin'), handler);
```

## How to Run

```bash
node server.js
# Swagger: http://localhost:8000/api-docs
```