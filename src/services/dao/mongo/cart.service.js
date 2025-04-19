import Cart from "../../db/models/carts.model.js";

export default class CartService{
    constructor(){}
    
    //Metodos que se pasan al controller
    buscarCarrito= async(cid)=>{
        try {
            let carrito= await Cart.findById(cid).populate("products.product");
            return carrito;
        } catch (error) {
            console.log(error)
        }
    };

    nuevoCarrito=async(products)=>{
        const newCart= new Cart({products})
        if (!newCart){
            return null
        }
        return await newCart.save()
    }

    guardarCarrito=async(cart)=>{
        return await cart.save();
    }
      

}