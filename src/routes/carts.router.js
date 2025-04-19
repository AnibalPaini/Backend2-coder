import express from "express";
import { passportCall, authorization } from "../utils.js";
import {
  postCartController,
  getCartIdController,
  putCartIdController,
  putCartIdCantidadController,
  deleteProductCartController,
  deleteCartController,
  finalizarCompraController
} from "../controller/cart.controller.js";

const cartRouter = express.Router();

//Post de carrito
cartRouter.post("/", passportCall("jwt"), postCartController);

//Get carrito por id
cartRouter.get("/:cid", passportCall("jwt"), getCartIdController);

//Put carrito por id, ingresa productos
cartRouter.put("/:cid", passportCall("jwt"), authorization("user"), putCartIdController);

//Put carrito para modificar la cantidad
cartRouter.put(
  "/:cid/products/:pid",
  passportCall("jwt"),
  authorization("user"),
  putCartIdCantidadController
);

//delete de products por id en el cart
cartRouter.delete(
  "/:cid/products/:pid",
  passportCall("jwt"),
  deleteProductCartController
);

//delete de la lista products
cartRouter.delete("/:cid", passportCall("jwt"), deleteCartController);

cartRouter.post("/:cid/purchase",passportCall("jwt"), finalizarCompraController)

export default cartRouter;
