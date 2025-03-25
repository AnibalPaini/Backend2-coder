import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productsSchema= mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    status:Boolean,
    stock:Number,
    category:String
})

productsSchema.plugin(paginate);

const Product= mongoose.model("Product", productsSchema)

export default Product;