import UsersDTO from "../dto/users.dto.js";

export default class UserRepository {
  #dao;

  constructor(dao) {
    this.#dao = dao;
  }

  obtenerUsuario = async () => {
    const usuarios = await this.#dao.obtenerUsuario();
    return usuarios.map((user) => new UsersDTO(user));
  };

  guardarUsuario = async (datos) => {
    const user = await this.#dao.guardarUsuario(datos);
    return new UsersDTO(user);
  };

  eliminarUsuario = async (id) => {
    const user = await this.#dao.eliminarUsuario(id);
    return user ? new UsersDTO(user) : null;
  };

  actualizarUsuario = async (id, datos) => {
    const user = await this.#dao.actualizarUsuario(id, datos);
    return user ? new UsersDTO(user) : null;
  };

  buscarUsuario = async (email) => {
    const user = await this.#dao.buscarUsuario(email);
    return user; 
  };

  saveUsuario = async (user) => {
    return await this.#dao.saveUsuario(user);
  };
}
