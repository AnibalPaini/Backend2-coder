import express from "express";
import { passportCall, authorization } from "../utils.js";
import {
  getProductsController,
  getProductByIdController,
  postProductController,
  putProductoByIdController,
  deleteProductByIdController,
} from "../controller/products.controller.js";

const productsRouter = express.Router();

productsRouter.get("/", getProductsController);

productsRouter.get("/:pid", getProductByIdController);

// Crear un nuevo producto
productsRouter.post(
  "/",
  passportCall("jwt"),
  authorization("admin"),
  postProductController
);

// Actualizar un producto existente
productsRouter.put(
  "/:pid",
  passportCall("jwt"),
  authorization("admin"),
  putProductoByIdController
);

// Eliminar un producto
productsRouter.delete(
  "/:pid",
  passportCall("jwt"),
  authorization("admin"),
  deleteProductByIdController
);

export default productsRouter;
