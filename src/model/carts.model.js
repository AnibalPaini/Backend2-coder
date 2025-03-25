import mongoose from "mongoose";

const cartsSchema= mongoose.Schema({
    products:{
        type:[
            {
                product:{type:mongoose.Schema.Types.ObjectId, ref:"Product"},
                quantity: { type: Number, default: 1 }
            }
        ],
        default:[]
    }
})

cartsSchema.pre("findById", function(next){
    this.populate("products.product");
    next();
})

const Cart=mongoose.model("Cart", cartsSchema);
export default Cart;