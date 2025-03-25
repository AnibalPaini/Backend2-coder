import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    first_name:String,
    last_name:String,
    email:{
        type:String,
        unique:true,
        required:true
    },
    age:Number,
    password:String, 
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart" // el nombre del modelo de carrito (cartModel)
    },
    role:{type:String, enum:["admin", "user"], default:"user"}
})

const userModel = mongoose.model("user", userSchema)
export default userModel;