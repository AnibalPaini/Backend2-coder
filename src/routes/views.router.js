import express from "express";
import {checkIfLoggedIn, passportCall, authorization} from "../utils.js"
import {
  viewProductsController,
  viewProductIdController,
  viewCartController,
  viewRealtimeProducts,
  viewTicketController
} from "../controller/view.controller.js";

const viewsRouter = express.Router();

viewsRouter.get("/",checkIfLoggedIn, viewProductsController);

viewsRouter.get("/products/:pid", viewProductIdController);

viewsRouter.get("/carts/:cid",passportCall("jwt"), viewCartController);

viewsRouter.get("/realtimeproducts",passportCall("jwt"), authorization("admin"),  viewRealtimeProducts);

viewsRouter.get("/ticket/:code",passportCall("jwt"), viewTicketController);


export default viewsRouter;
