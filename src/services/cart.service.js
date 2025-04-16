import Cart from "../model/carts.model.js";

export default class CartService{
    constructor(){}
    
    //Metodos que se pasan al controller
    buscarCarrito= async(cid)=>{
        let carrito= await Cart.findById(cid);
        return carrito || null;
    };

}