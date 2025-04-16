import {
  isValidPassword,
  generateToken,
  cookieExtractor,
  authorization,
} from "../utils.js";

import UserService from "../services/user.service.js";
import CartService from "../services/cart.service.js";

const userService = new UserService();
const cartService = new CartService();

export const getUsuariosController = async (req, res) => {
  try {
    let usuarios = await userService.obtenerUsuario();
    if (!usuarios) {
      console.log("No se encontraron usuarios");
      res.status(400).send("No se encontraron usuarios");
    } else {
      res.status(200).send({ status: "Success", payload: usuarios });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al obtener los usuarios" });
  }
};

export const registerUsuarioController = async (req, res) => {
  try {
    console.log("Usuario registrado!");
    res.status(201).send({ status: "success", message: "Usuario creado" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al crear usuario!" });
  }
};

export const deleteUsuarioController = async (req, res) => {
  try {
    let uid = req.params.id;
    let usuarioEliminar = await userService.eliminarUsuario(uid);
    if (!usuarioEliminar) {
      return res.status(404).send({ error: "No se pudo eliminar el usuario!" });
    }
    res.status(200).send({ status: "Success", payload: usuarioEliminar });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al eliminar usuario!" });
  }
};

export const putUsuariosController = async (req, res) => {
  try {
    let uid = req.params.id;
    let usuarioActualizado = req.body;
    let usuario = await userService.actualizarUsuario(uid, usuarioActualizado);
    if (!usuario) {
      return res
        .status(404)
        .send({ status: "error", error: "Error al modificar usuario!" });
    }
    res.status(200).send({ status: "Success", payload: usuario });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al modificar usuario!" });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.buscarUsuario(email);
    if (!user)
      return res.status(401).send({ error: "No se encontro el usuario!" });

    if (!isValidPassword(user, password)) {
      return res.status(401).send({ error: "Credenciales erroneas!" });
    }

    // Buscar el carrito asociado al usuario
    const userCart = await cartService.buscarCarrito(user.cart);

    if (!userCart) {
      return res.status(404).send({ error: "Carrito no encontrado!" });
    }

    const tokenUser = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: userCart._id.toString(),
    };

    //Generar JWT
    const access_token = generateToken(tokenUser);
    //Generamos la cookie con el token
    res.cookie("jwtCookieToken", access_token, {
      maxAge: 60000,
      httpOnly: true, //No expone la cookie
      //secure:
    });

    // Guardamos el cartId en una cookie accesible desde JavaScript
    res.cookie("cartId", userCart._id.toString(), {
      maxAge: 60000,
      httpOnly: false,
    });

    res.status(200).send({ status: "success", message: "Usuario logeado!", cart: userCart });
  } catch (error) {
    console.log(error);
    res.status(401).send({ status: "error", error: "Error en el logeo" });
  }
};

export const userLogoutController = (req, res) => {
  res.clearCookie("jwtCookieToken");
  res.redirect("/users/login");
};

export const getUserProfile = async (req, res) => {
  try {
    res.send({ payload: req.user });
  } catch (error) {
    res.send({ error: "Error al obtener el usuario" });
  }
};
