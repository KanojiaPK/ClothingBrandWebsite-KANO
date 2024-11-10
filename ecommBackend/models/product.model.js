import mongoose from "mongoose";
import categoryModel from "./category.model.js";
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: categoryModel,
  },
  description: {
    type: String,
    default: null,
  },
  avaliablein: {
    type: String,
    default: null,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  sizes: {
    type: Array,
    default: [34, 36, 38, 40, 42, 44, 46],
  },
  thumbnail: {
    type: String,
    default: null,
  },
  images: {
    type: [String],
    default: [1, 2, 3, 4],
  },
  status: {
    type: Number,
    default: 1,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("product", productSchema);
