import { isValidPassword, generateToken, generateHash } from "../utils.js";

import { userRepositoryService, cartRepositoryService } from "../services/service.js";

export const getUsuariosController = async (req, res) => {
  try {
    let usuarios = await userRepositoryService.obtenerUsuario();
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
    const { first_name, last_name, email, age, password, role } = req.body;
  
    // Validar campos obligatorios
    if (!first_name || !last_name || !email || !age || !password)
      return res.status(400).send("Todos los campos son necesarios!");
  
    // Verificar si el usuario ya existe
    const exist = await userRepositoryService.buscarUsuario(email);
    if (exist) {
      return res.status(409).send({ error: "Usuario ya existente" });
    }
  
    // Crear nuevo usuario
    const usuario = await userRepositoryService.guardarUsuario({
      first_name,
      last_name,
      email,
      age,
      password: generateHash(password),
      role: role || "user", 
    });
  
    res.status(201).send({ status: "Success", payload: usuario });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error al crear usuario!" });
  }
};


export const deleteUsuarioController = async (req, res) => {
  try {
    let uid = req.params.id;
    let usuarioEliminar = await userRepositoryService.eliminarUsuario(uid);
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
    let usuario = await userRepositoryService.actualizarUsuario(
      uid,
      usuarioActualizado
    );
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
    const user = await userRepositoryService.buscarUsuario(email);
    if (!user)
      return res.status(401).send({ error: "No se encontro el usuario!" });

    if (!isValidPassword(user, password)) {
      return res.status(401).send({ error: "Credenciales erroneas!" });
    }

    // Buscar el carrito asociado al usuario
    let userCart = await cartRepositoryService.buscarCarrito(user.cart);

    if (!userCart) {
      let nuevoCarrito = await cartRepositoryService.nuevoCarrito([]);
      user.cart = nuevoCarrito._id;
      await userRepositoryService.saveUsuario(user);
      userCart = nuevoCarrito;
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

    res
      .status(200)
      .send({ status: "success", message: "Usuario logeado!", cart: userCart });
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
