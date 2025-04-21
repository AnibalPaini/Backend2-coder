import {
  cartRepositoryService,
  productRepositoryService,
  ticketRepositoryService,
  sendEmailRepositoryService
} from "../services/service.js";

export const postCartController = async (req, res) => {
  try {
    const { products = [] } = req.body;
    if (!Array.isArray(products)) {
      return res
        .status(400)
        .send({ message: "El formato del producto es incorrecto" });
    }

    const newCart = await cartRepositoryService.nuevoCarrito(products);
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
    const cart = await cartRepositoryService.buscarCarrito(cid);
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

export const putCartIdController = async (req, res) => {
  try {
    const { cid } = req.params;
    const { product, quantity } = req.body;

    if (!product || quantity <= 0) {
      return res.status(400).send({
        message:
          "Producto y cantidad son obligatorios y la cantidad debe ser mayor a 0.",
      });
    }

    const cart = await cartRepositoryService.buscarCarrito(cid);
    if (!cart) {
      return res.status(404).send({ message: "Carrito no encontrado" });
    }

    //Busca en el carrito si ya existe un producto específico.
    const productId = cart.products.findIndex(
      (p) => p.product.id.toString() === product.toString()
    );
    if (productId !== -1) {
      cart.products[productId].quantity += quantity;
    } else {
      cart.products.push({ product, quantity });
    }

    await cartRepositoryService.guardarCarrito(cart);

    res.status(200).send({ status: "success", payload: cart });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res
      .status(500)
      .send({ status: "error", message: "Error interno del servidor" });
  }
};

export const putCartIdCantidadController = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res
        .status(400)
        .send({ message: "la cantidad debe ser mayor a 0." });
    }

    const cart = await cartRepositoryService.buscarCarrito(cid);
    if (!cart) {
      return res.status(404).send({ message: "Carrito no encontrado" });
    }

    //Busco el id del producto que quiero actualizar
    const productId = cart.products.findIndex(
      (p) => p.product._id.toString() === pid.toString()
    );
    if (productId === -1) {
      return res
        .status(404)
        .send({ message: "Producto no encontrado en el carrito" });
    }
    cart.products[productId].quantity = quantity; //actualizo la cantidad

    await cartRepositoryService.guardarCarrito(cart);
    res.status(200).send({ status: "success", payload: cart });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res
      .status(500)
      .send({ status: "error", message: "Error interno del servidor" });
  }
};

export const deleteProductCartController = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartRepositoryService.buscarCarrito(cid);
    if (!cart) {
      return res.status(404).send({ message: "Carrito no encontrado" });
    }
    const productId = cart.products.findIndex(
      (p) => p.product._id.toString() === pid.toString()
    );
    if (productId === -1) {
      return res
        .status(404)
        .send({ message: "Producto no encontrado en el carrito" });
    }
    cart.products.splice(productId, 1);
    await cartRepositoryService.guardarCarrito(cart);
    res.status(200).send({ status: "success", payload: cart });
  } catch (error) {
    console.error("Error al eliminar producto al carrito:", error);
    res
      .status(500)
      .send({ status: "error", message: "Error interno del servidor" });
  }
};

export const deleteCartController = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartRepositoryService.buscarCarrito(cid);
    if (!cart) {
      return res.status(404).send({ message: "Carrito no encontrado" });
    }
    cart.products = [];
    await cartRepositoryService.guardarCarrito(cart);
    res.status(200).send({ status: "success", payload: cart });
  } catch (error) {
    console.error("Error al eliminar producto al carrito:", error);
    res
      .status(500)
      .send({ status: "error", message: "Error interno del servidor" });
  }
};

export const finalizarCompraController = async (req, res) => {
  const cid = req.params.cid;

  try {
    const cart = await cartRepositoryService.buscarCarrito(cid);
    if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });

    const productosNoProcesados = [];
    const productosComprados = []
    let total = 0;

    // Verificación de stock y descuento
    for (const item of cart.products) {
      const product = await productRepositoryService.obtenerProductoIdNoLean(
        item.product._id
      ); 

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        productosComprados.push({
          title: product.title,
          price: product.price,
          quantity: item.quantity,
          subtotal: product.price * item.quantity,
        });
        await productRepositoryService.guardarProducto(product);
        total += product.price * item.quantity;
      } else {
        console.log(`Producto no procesado: ${item.product._id}`); 
        productosNoProcesados.push(item.product._id.toString());
      }
    }
    // Limpiar el carrito de productos procesados
    cart.products = cart.products.filter((item) =>
      productosNoProcesados.includes(item.product._id.toString())
    );
    await cartRepositoryService.guardarCarrito(cart);

    if (total===0){
      return res.status(400).send({error:"Productos ingresados no estan en stock!"})
    }

    // Crear el ticket
    const ticketData = {
      amount: total,
      purchaser: req.user.email,
      productosNoProcesados: productosNoProcesados,
    };
    const ticket = await ticketRepositoryService.createTicket(ticketData);

    
    //Enviamos el email con los datos del ticket
    ticket.productosComprados = productosComprados;
    sendEmailRepositoryService.enviarMailTicket(ticket)

    res.status(200).json({
      status: "Compra procesada",
      ticket: ticket,
      productosNoProcesados: productosNoProcesados,
    });

  } catch (error) {
    console.error("Error al finalizar la compra:", error);
    res.status(500).send({ error: "Error al finalizar la compra" });
  }
};
