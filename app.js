const express = require('express')
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const authRouter = require('./routes/authRoutes');
const orderRouter = require('./routes/orderRoutes');
const swaggerSpecs = require('./swagger/swagger');

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next();
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', authRouter);
app.use('/api/v1/orders', orderRouter); 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.all('/{*splat}', (req, res, next) => {
    return next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler)

module.exports = app;
