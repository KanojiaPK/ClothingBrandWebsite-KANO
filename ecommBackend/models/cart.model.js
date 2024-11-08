import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  productID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("cart", cartSchema);
