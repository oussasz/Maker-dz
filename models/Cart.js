import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  personalization: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});


cartSchema.statics.populateWithVariants = async function(cartId) {
  const cart = await this.findById(cartId)
    .populate("items.productId", "name mainImages variants sellerId")
    .populate("userId", "name email");

  if (!cart) return null;

  return this.attachVariantData(cart);
};

cartSchema.statics.attachVariantData = function(cart) {
  if (!cart || !cart.items) return cart;
  
  cart.items = cart.items.map((item) => {
    if (item.productId && item.productId.variants) {
      const variant = item.productId.variants.find(
        (v) => v._id.toString() === item.variantId.toString()
      );

      if (variant) {
        return {
          ...item.toObject(),
          variantData: variant,
        };
      }
    }
    return item;
  });

  return cart;
};

export default mongoose.model('Cart', cartSchema);
