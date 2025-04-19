import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productsSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default:true, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
});

productsSchema.plugin(paginate);

const Product = mongoose.model("Product", productsSchema);

export default Product;
