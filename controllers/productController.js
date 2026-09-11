const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


//create 
exports.createProduct = catchAsync(async (req, res, next) => {
    const { name, description, price, category, stock, imageUrl } = req.body;

    if (!name || price === undefined || stock === undefined) {
        return next(
            new AppError('Name, price and stock are required', 400)
        );
    }

    if (price < 0) {
        return next(new AppError('Price cannot be negative', 400));
    }

    if (stock < 0) {
        return next(new AppError('Stock cannot be negative', 400));
    }

    const product = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        imageUrl
    });

    res.status(201).json({
        status: 'success',
        data: {
            product
        }
    });
});


//get all 
exports.getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: {
            products
        }
    });
});


//get by iD
exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new AppError('No product found with that ID', 404)
        );
    }

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
});


//update product
exports.updateProduct = catchAsync(async (req, res, next) => {
    const { name, description, price, category, stock, imageUrl } = req.body;

    if (price !== undefined && price < 0) {
        return next(new AppError('Price cannot be negative', 400));
    }

    if (stock !== undefined && stock < 0) {
        return next(new AppError('Stock cannot be negative', 400));
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        },
        {
            returnDocument: 'after',
            runValidators: true
        }
    );

    if (!product) {
        return next(
            new AppError('No product found with that ID', 404)
        );
    }

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
});


//delete product
exports.deleteProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new AppError('No product found with that ID', 404)
        );
    }

    const existingOrder = await Order.findOne({
        'items.product': product._id
    });

    if (existingOrder) {
        return next(
            new AppError(
                'Cannot delete a product that exists in previous orders',
                400
            )
        );
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'success',
        data: null
    });
});