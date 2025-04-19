export default class ProductRepository {
  #dao;

  constructor(dao) {
    this.#dao = dao;
  }

  async obtenerProductos() {
    return await this.#dao.obtenerProductos();
  }

  async obtenerProductosQuerys(query, page, limit, sort) {
    return await this.#dao.obtenerProductosQuerys(query, page, limit, sort);
  }

  async obtenerProductoID(pid) {
    return await this.#dao.obtenerProductoID(pid);
  }

  async postearProducto(productoData) {
    return await this.#dao.postearProducto(productoData);
  }

  async actualizarProductoId(pid, productoData) {
    return await this.#dao.actualizarProductoId(pid, productoData);
  }

  async eliminarProductoId(pid) {
    return await this.#dao.eliminarProductoId(pid);
  }

  async viewsProductos(page, limit) {
    return await this.#dao.viewsProductos(page, limit);
  }

  async guardarProducto (product) {
    return await this.#dao.guardarProducto(product)
  };

  async obtenerProductoIdNoLean (pid) {
    return await this.#dao.obtenerProductoIdNoLean(pid)
  };
  
  
}

