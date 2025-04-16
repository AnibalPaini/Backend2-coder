import Cart from "../model/carts.model.js";

export default class CartService{
    constructor(){}
    
    //Metodos que se pasan al controller
    buscarCarrito= async(cid)=>{
        let carrito= await Cart.findById(cid).populate("products.product");
        return carrito || null;
    };

    nuevoCarrito=async(products)=>{
        const newCart=await new Cart({products})
        if (!newCart){
            return null
        }
        return await newCart.save()
    }

}