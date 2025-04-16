import {
  isValidPassword,
  generateToken,
  cookieExtractor,
  authorization,
} from "../utils.js";

import UserService from "../services/user.service.js";
import CartService from "../services/cart.service.js";

const userService = new UserService();
const cartService = new CartService();

export const postCartController = async (req, res) => {
  try {
    const { products = [] } = req.body;
    if (!Array.isArray(products)) {
      return res
        .status(400)
        .send({ message: "El formato del producto es incorrecto" });
    }

    const newCart = await cartService.nuevoCarrito(products);
    if (!newCart) {
      return res.status(400).send({ error: "Error en el carrito" });
    }

    res.status(201).send({ status: "success", payload: newCart });
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).send({ message: "Error interno del servidor" });
  }
};

export const getCartIdController = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.buscarCarrito(cid);
    if (!cart) {
      return res.status(404).send({ message: "Carrito no encontrado" });
    }
    res.status(200).send({ status: "success", payload: cart });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res
      .status(500)
      .send({ status: "error", message: "Error interno del servidor" });
  }
};

export const putCartIdController=async(req,res)=>{
    try {
        const { cid } = req.params;
        const { product, quantity } = req.body;

        if (!product || quantity <= 0) {
            return res.status(400).send({ message: "Producto y cantidad son obligatorios y la cantidad debe ser mayor a 0." });
        }

        const cart = await cartService.buscarCarrito(cid);
        if (!cart) {
            return res.status(404).send({ message: "Carrito no encontrado" });
        }

        //Busca en el carrito si ya existe un producto específico.
        const productId= cart.products.findIndex(p => p.product.toString() === product);
        if(productId===-1){
            cart.products[productId].quantity+=quantity;
        }else{
            cart.products.push({product,quantity})
        }

    } catch (error) {
        
    }
}
