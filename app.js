const express = require('express')
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const orderRouter = require('./routes/orderRoutes');
const productRouter = require('./routes/productRoutes');
const aiRouter = require('./routes/aiRoutes');
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

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/ai', aiRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.all('/{*splat}', (req, res, next) => {
    return next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler)

module.exports = app;
