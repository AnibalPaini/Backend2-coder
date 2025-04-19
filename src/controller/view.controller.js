import {
  productRepositoryService,
  cartRepositoryService,
  ticketRepositoryService,
} from "../services/service.js";

export const viewProductsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const products = await productRepositoryService.viewsProductos(page, limit);
    const isAdmin = req.user && req.user.role === "admin";
    res.render("home", { ...products, user: req.user, isAdmin });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

export const viewProductIdController = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productRepositoryService.obtenerProductoID(pid);
    res.render("productDetail", { product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

export const viewCartController = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartRepositoryService.buscarCarrito(cid);

    if (!cart) {
      console.error("Error: no se encontró el carrito");
      return res.status(404).send({ message: "Carrito no encontrado" });
    }

    res.render("cart", { cart: cart.toObject() }); // <-- convierte a objeto plano si es un documento de Mongoose
  } catch (error) {
    console.error("Error en viewCartController:", error);
    res.status(500).send({ message: error.message }); // <-- corregí `Error.message` por `error.message`
  }
};

export const viewRealtimeProducts = async (req, res) => {
  try {
    const products = await productRepositoryService.obtenerProductos();
    res.render("realtimeproducts", { products });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

export const viewTicketController = async (req, res) => {
  try {
    const { code } = req.params;
    const ticket = await ticketRepositoryService.getTicketByCode(code);

    if (!ticket) {
      return res
        .status(404)
        .render("error", { message: "Ticket no encontrado" });
    }

    const productosNoProcesadosIds = ticket.productosNoProcesados || [];

    const productosNoProcesados = await Promise.all(
      productosNoProcesadosIds.map(async (id) => {
        const producto = await productRepositoryService.obtenerProductoID(id);
        return producto ? producto : `Producto (${id}) no encontrado`;
      })
    );

    res.render("ticket", { ticket, productosNoProcesados });
  } catch (error) {}
};
