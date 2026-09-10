const express = require('express')
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next();
});

app.use(express.json());

app.all('/{*splat}', (req, res, next) => {
    return next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler)

module.exports = app;
