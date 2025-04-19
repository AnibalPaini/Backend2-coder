import { productRepositoryService } from "../services/service.js";

export const getProductsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 9);
    const sort =
      req.query.sort === "asc"
        ? { price: 1 }
        : req.query.sort === "desc"
        ? { price: -1 }
        : {};
    const query = req.query.query ? { category: req.query.query } : {};
    const products = await productRepositoryService.obtenerProductosQuerys(
      query,
      page,
      limit,
      sort
    );
    res.status(200).send({ status: "success", payload: products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send({ status: "error", mesagge: error.message });
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    const { pid } = req.params;
    const productID = await productRepositoryService.obtenerProductoID(pid);
    if (!productID) {
      return res.status(404).send({ mesagge: "No se encuentra el producto" });
    }
    res.status(200).send({ status: "success", payload: productID });
  } catch (error) {
    res.status(500).send({ status: "error", mesagge: error.message });
  }
};

export const postProductController = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      status = true,
      stock,
      category,
    } = req.body;
    const newProduct = await productRepositoryService.postearProducto({
      title,
      description,
      price,
      status,
      stock,
      category,
    });
    res.status(201).send({ status: "success", payload: newProduct });
  } catch (error) {
    res.status(400).send({
      message: "Datos inválidos o error al crear el producto.",
      error: error.message,
    });
  }
};

export const putProductoByIdController = async (req, res) => {
  try {
    const { pid } = req.params;
    const { title, description, price, status, stock, category } = req.body;
    if (!title || !description || price == null || stock == null || !category) {
        return res.status(400).send({ message: "Faltan campos obligatorios" });
    }
    const updatedProduct = await productRepositoryService.actualizarProductoId(pid, {
      title,
      description,
      price,
      status,
      stock,
      category,
    });
    if (!updatedProduct) {
      return res.status(404).send({ message: "Producto no encontrado" });
    }
    res.status(200).send({ status: "success", payload: updatedProduct });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).send({
      message: "Error al intentar actualizar el producto.",
      error: error.message,
    });
  }
};

export const deleteProductByIdController = async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await productRepositoryService.eliminarProductoId(pid);
    if (!deletedProduct) {
      return res.status(404).send({ message: "Producto no encontrado" });
    }
    res.status(200).send({
      status: "success",
      message: "Producto eliminado",
      payload: deletedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al eliminar el producto", error: error.message });
  }
};
