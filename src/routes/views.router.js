import express from "express";
import Product from "../model/products.model.js";
import Cart from "../model/carts.model.js";



const viewsRouter=express.Router();

viewsRouter.get("/", async(req, res)=>{
    try {
        const page= parseInt(req.query.page) || 1; 
        const limit=6;
        const products= await Product.paginate({},{page, limit, lean:true})
        res.render("home", products)
    } catch (error) {
        console.log(error);
        res.status(500).send({message: Error.message})
    }
})
viewsRouter.get("/products/:pid", async(req, res)=>{
    try {
        const {pid}= req.params;
        const product= await Product.findById(pid).lean()
        res.render("productDetail", {product})
    } catch (error) {
        console.log(error);
        res.status(500).send({message: Error.message})
    }
})

viewsRouter.get("/carts/:cid", async(req, res)=>{
    try {
        const {cid}= req.params;
        const cart= await Cart.findById(cid).populate('products.product').lean()
        res.render("cart",{cart})
    } catch (error) {
        console.log(error);
        res.status(500).send({message: Error.message})
    }
}) 


viewsRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render("realtimeproducts", { products });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});


export default viewsRouter;