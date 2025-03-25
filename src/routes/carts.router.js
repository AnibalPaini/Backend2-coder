import express from "express";
import Cart from "../model/carts.model.js"

const cartRouter=express.Router();

//Post de carrito
cartRouter.post("/", async (req, res) => {
    try {
        const { products = [] } = req.body; 

        if (!Array.isArray(products)) {
            return res.status(400).send({ message: "El formato de productos es incorrecto" });
        }

        const newCart = new Cart({ products });

        await newCart.save();

        res.status(201).send({ status: "success", payload: newCart });
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
});

//Get carrito por id
cartRouter.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await Cart.findById(cid).populate("products.product");

        if (!cart) {
            return res.status(404).send({ message: "Carrito no encontrado" });
        }

        res.status(200).send({ status: "success", payload: cart });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
});

//Put carrito por id, ingresa productos
cartRouter.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { product, quantity } = req.body;

        if (!product || quantity <= 0) {
            return res.status(400).send({ message: "Producto y cantidad son obligatorios y la cantidad debe ser mayor a 0." });
        }

        const cart = await Cart.findById(cid);

        if (!cart) {
            return res.status(404).send({ message: "Carrito no encontrado" });
        }
        
        const productId= cart.products.findIndex(p => p.product.toString() === product);
        //Buscamos si ya existe el producto en el carrito, si existe lo sumamos a la cantidad, sino se pushea.
        if (productId !== -1) {
            cart.products[productId].quantity += quantity;
        }else{
            cart.products.push({ product, quantity })
        }

        await cart.save();

        res.status(200).send({ status: "success", payload:cart });
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
});

//Put carrito para modificar la cantidad
cartRouter.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (quantity <= 0) {
            return res.status(400).send({ message: "la cantidad debe ser mayor a 0." });
        }

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).send({ message: "Carrito no encontrado" });
        }

        //Busco el id del producto que quiero actualizar
        const productId= cart.products.findIndex(p => p.product.toString() === pid);
        if (productId === -1) {
            return res.status(404).send({ message: "Producto no encontrado en el carrito" });
        }
        
        cart.products[productId].quantity=quantity; //actualizo la cantidad
        await cart.save();

        res.status(200).send({ status: "success", payload:cart });
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
});

cartRouter.delete("/:cid/products/:pid", async(req, res)=>{
    try{
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).send({ message: "Carrito no encontrado" });
        }
        const productId= cart.products.findIndex(p => p.product.toString() === pid);
        if (productId === -1) {
            return res.status(404).send({ message: "Producto no encontrado en el carrito" });
        }
        cart.products.splice(productId, 1); //eliminamos del array el producto
        cart.save();
        res.status(200).send({ status: "success", payload:cart });
    }catch(error){
        console.error("Error al eliminar producto al carrito:", error);
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
})

cartRouter.delete("/:cid", async(req, res)=>{
    try{
        const { cid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).send({ message: "Carrito no encontrado" });
        }
        cart.products=[]; //Vaciamos el array de products
        await cart.save();
        res.status(200).send({ status: "success", payload:cart });
    }catch(error){
        console.error("Error al eliminar producto al carrito:", error);
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
})






export default cartRouter;