import { Router } from "express";
import passport from "passport";
import userModel from "../model/user.model.js";
import Cart from "../model/carts.model.js";
import { isValidPassword, generateToken, passportCall, authorization } from "../utils.js";

const sessiosRouter = Router();

sessiosRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/fail-register",
  }),
  async (req, res) => {
    console.log("Usuario registrado!");
    res.status(201).send({ status: "success", message: "Usuario creado" });
  }
);

sessiosRouter.get("/fail-register", (req, res) => {
  res.status(401).send({ error: "Error al registrarse!" });
});

sessiosRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email: email });
    if (!user)
      return res.status(401).send({ error: "No se encontro el usuario!" });

    if (!isValidPassword(user, password)) {
      return res.status(401).send({ error: "Credenciales erroneas!" });
    }

    // Buscar el carrito asociado al usuario
    const userCart = await Cart.findById(user.cart);

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
    res.cookie("jwtCookie", access_token, {
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
});

sessiosRouter.get("/logout", (req, res) => {
  res.clearCookie("jwtCookieToken");
  res.redirect("/users/login");
});

sessiosRouter.get("/current", passportCall("jwt"), async (req, res) => {
  try {
    res.send({ payload: req.user });
  } catch (error) {
    res.send({ error: "Error al obtener el usuario" });
  }
});

//Delete user
sessiosRouter.delete(
  "/deleteUser/:id",
  passportCall('jwt'),
  authorization("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userModel.findByIdAndDelete(id);

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.send({ error: "Error al obtener el usuario" });
    }
  }
);

//Put user
sessiosRouter.put(
  "/updateUser/:id",
  passportCall('jwt'),
  authorization("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const userUpdate = req.body;

      const response = await userModel.findByIdAndUpdate(id, userUpdate);
      if (!response) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.status(201).send({ status: "success", payload: response });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "error", mesagge: mesagge.error });
    }
  }
);

export default sessiosRouter;
