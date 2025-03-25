import express from "express";
import Product from "../model/products.model.js"

const productsRouter=express.Router();


productsRouter.get("/", async (req, res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const sort = req.query.sort === "asc" ? { price: 1 } : req.query.sort === "desc" ? { price: -1 } : {};
        const query = req.query.query ? { category: req.query.query } : {}; // Filtra por categoría (camiseta, bermuda, musculosa)

        const products = await Product.paginate(query, { page, limit, sort, lean: true });


        res.status(200).send({status:"success", payload:products})
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send({status:"error" ,mesagge:error.message})
    }
});

 productsRouter.get("/:pid", async(req, res)=>{
    try {
        const {pid}=req.params;
        const productID= await Product.findById({_id:pid})
        if (!productID){
            return res.status(404).send({mesagge:"No se encuentra el producto"})
        }else{
            res.status(200).send({status:"success", payload:productID})
        }
    } catch (error) {
        res.status(500).send({status:"error" ,mesagge:error.message})
    }
});

// Crear un nuevo producto
productsRouter.post("/", async (req, res) => {
    try {
        const { title, description, price, status = true, stock, category} = req.body;
        // Crea un nuevo producto y lo guarda en la base de datos
        const newProduct = new Product({ title, description, price, status, stock, category});
        await newProduct.save(); 

        res.status(201).send({ status: "success", payload: newProduct });
    } catch (error) {
        res.status(400).send({ message: "Datos inválidos o error al crear el producto.", error: error.message });
    }
});

// Actualizar un producto existente
productsRouter.put("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const { title, description, price, status, stock, category} = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            pid,
            { title, description, price, status, stock, category},
            { new: true } 
        );

        if (!updatedProduct) {
            return res.status(404).send({ message: "Producto no encontrado" });
        }

        res.status(200).send({ status: "success", payload: updatedProduct });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).send({ message: "Error al intentar actualizar el producto.", error: error.message });
    }
});

// Eliminar un producto
productsRouter.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;

        // Elimina el producto por ID
        const deletedProduct = await Product.findByIdAndDelete(pid);

        if (!deletedProduct) {
            return res.status(404).send({ message: "Producto no encontrado" });
        }

        res.status(200).send({ status: "success", message: "Producto eliminado", payload: deletedProduct });
    } catch (error) {
        res.status(500).send({ message: "Error al eliminar el producto", error: error.message });
    }
});



export default productsRouter;