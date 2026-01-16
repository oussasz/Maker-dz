import mongoose from 'mongoose';

const productVariantSchema = new mongoose.Schema({
  attributes: {
    type: Map, // dynamic key-value object
    of: String, 
    required: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  images: [String],
  index: Number 
});

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  variantOptions: Object,
  variantVariables: [String],
  variants: [productVariantSchema],
  mainImages: {
    type: [String],
    required: true
  },
  specifications: {
    type: Map,
    of: String
  },
  tags: [String],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalSold: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
});

productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ sellerId: 1 });
productSchema.index({ categories: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });

export default mongoose.model('Product', productSchema);
