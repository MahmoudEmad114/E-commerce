const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
     {
          product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', 
          required: [true, 'Order item must belong to a product']
          },
          price: {
          type: Number,
          required: [true, 'Price is required']
          },
          quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1']
          },
     }
);

const orderSchema = new mongoose.Schema(
     {
               customer: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User', 
               required: [true, 'Order must belong to a customer']
          },

          totalPrice: {
               type: Number,
               required: [true, 'Total price is required'],
               min: [0, 'Total price cannot be negative']
          },
          status: {
               type: String,
               enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
               default: 'Pending'
          },

          items: {
               type: [orderItemSchema],
               validate: {
               validator: function (arr) {
                    return arr.length > 0;
               },
               message: 'Order must contain at least one item'
               }
          },
     },
     {
     timestamps: true // createdAt , updatedAt
     }
);

module.exports = mongoose.model('Order', orderSchema);