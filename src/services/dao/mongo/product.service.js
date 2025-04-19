import Product from "../../db/models/products.model.js";

export default class ProductService {
  constructor() {}

  obtenerProductos = async () => {
    return await Product.find().lean();
  };

  obtenerProductosQuerys = async (query, page = 1, limit = 9, sort = {}) => {
    return Product.paginate(query, { page, limit, sort });
  };

  obtenerProductoID = async (pid) => {
    return (await Product.findById(pid).lean()) || null;
  };

  obtenerProductoIdNoLean = async (pid) => {
    return (await Product.findById(pid)) || null;
  };


  postearProducto = async ({
    title,
    description,
    price,
    status = true,
    stock,
    category,
  }) => {
    const newProduct = new Product({
      title,
      description,
      price,
      status,
      stock,
      category,
    });
    return await newProduct.save();
  };

  actualizarProductoId = async (
    pid,
    { title, description, price, status, stock, category }
  ) => {
    return await Product.findByIdAndUpdate(
      pid,
      { title, description, price, status, stock, category },
      { new: true }
    );
  };

  eliminarProductoId = async (pid) => {
    return await Product.findByIdAndDelete(pid);
  };

  viewsProductos = async (page, limit) => {
    return await Product.paginate({}, { page, limit, lean: true });
  };

  guardarProducto = async (product) => {
    return await product.save();
  };
}
