import mongoose from 'mongoose';
import Product from "./Product.js"
import User from './SimpleUser.js';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  personalization: String,
  name: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: {
      id: Number,
      commune_name_ascii: String,
      commune_name: String
    },
    state: {
      wilaya_code: String,
      wilaya_name_ascii: String,
      wilaya_name: String
    },
    country: String
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  notes: String,
  cancelledAt: Date,
  deliveredAt: Date
}, { 
  timestamps: true 
});

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ 'items.sellerId': 1 });


// Pre-save middleware to verify existence
orderItemSchema.pre('save', async function(next) {
  try {
    
    // Check if product exists
    const product = await Product.findById(this.productId);
    if (!product) {
      return next(new Error(`Product with ID ${this.productId} not found`));
    }
    
    // Check if seller exists and is actually a seller
    const seller = await User.findById(this.sellerId);
    if (!seller) {
      return next(new Error(`Seller with ID ${this.sellerId} not found`));
    }
    
    // Verify the product belongs to this seller
    if (product.sellerId.toString() !== this.sellerId.toString()) {
      return next(new Error('Product does not belong to the specified seller'));
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Order', orderSchema);
