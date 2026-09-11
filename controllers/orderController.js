const Order = require('../models/Order')
const Product = require('../models/Product');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createOrder = catchAsync(async (req, res, next) => {
     const {items } = req.body;

     if (!items || items.length === 0) {
     return next(new AppError('Order cannot be empty', 400));
     }

     const productIds = items.map(i => i.productId);
     const hasDuplicates = new Set(productIds).size !== productIds.length;
     if (hasDuplicates) {
     return next(new AppError('Duplicate products in order', 400));
     }
     
     const orderItems = [];
     let totalPrice = 0;

     for (const item of items) {
          if (!item.quantity || item.quantity <= 0) {
               return next(new AppError('Quantity must be greater than zero', 400));
          }

          const product = await Product.findById(item.productId);
          if (!product) {
               return next(new AppError(`Product ${item.productId} not found`, 404));
          }

          if (product.stock === 0) {
               return next(new AppError(`${product.name} is out of stock`, 400));
          }

          if (item.quantity > product.stock) {
               return next(new AppError(`Insufficient stock for ${product.name}`, 400));
          }

          orderItems.push({
               product: product._id,
               quantity: item.quantity,
               price: product.price
          });

          totalPrice += product.price * item.quantity;

          product.stock -= item.quantity;
          await product.save();
     }

     const order = await Order.create({
     customer: req.user.id,
     items: orderItems,
     totalPrice,
     status: 'Pending'
     });

     res.status(201).json({
     status: 'success',
     data: { order }
     });
});


exports.getMyOrders = catchAsync(async (req, res, next)=>{
     const orders = await Order.find({ customer: req.user.id }).populate(
     'items.product',
     'name price imageUrl'
     );

     res.status(200).json({
     status: 'success',
     results: orders.length,
     data: { orders }
     });
});

exports.getOrderById  = catchAsync(async (req, res, next)=>{
     const order = await Order.findById(req.params.id ).populate(
     'items.product',
     'name price imageUrl'
     );
     if (!order) {
          return next(new AppError('Order not found', 404));
     }
     if (order.customer.toString() !== req.user.id) {
          return next(new AppError('Access denied', 403));
     }

     res.status(200).json({
     status: 'success',
     data: { order }
     });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.customer.toString() !== req.user.id) {
    return next(new AppError('Access denied', 403));
  }

  if (order.status === 'Cancelled') {
    return next(new AppError('Order is already cancelled', 400));
  }

  if (order.status === 'Delivered') {
    return next(new AppError('Cannot cancel a delivered order', 400));
  }

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity }
    });
  }

  order.status = 'Cancelled';
  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Order cancelled successfully',
    data: { order }
  });
});
