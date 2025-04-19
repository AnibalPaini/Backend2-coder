export default class CartRepository {
  #dao;

  constructor(dao) {
    this.#dao = dao;
  }

  buscarCarrito = async (cid) => {
    return await this.#dao.buscarCarrito(cid);
  };

  nuevoCarrito = async (products) => {
    return await this.#dao.nuevoCarrito(products); 
  };

  guardarCarrito = async (cart) => {
    return await this.#dao.guardarCarrito(cart);
  };
}

