import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  categoryname: {
    type: String,
    required: true,
  },
  categorytype: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    default: null,
  },

description:{
  type:String,
  default:null
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

export default mongoose.model("category", CategorySchema);
