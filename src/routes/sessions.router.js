import { Router } from "express";
import passport from "passport";
import userModel from "../model/user.model.js";
import Cart from "../model/carts.model.js";
import {
  isValidPassword,
  generateToken,
  passportCall,
  authorization,
} from "../utils.js";

import {
  getUsuariosController,
  userLogoutController,
  registerUsuarioController,
  deleteUsuarioController,
  putUsuariosController,
  loginController,
  getUserProfile,
} from "../controller/users.controller.js";

const sessiosRouter = Router();

sessiosRouter.get(
  "/getusers",
  passportCall("jwt"),
  authorization("admin"),
  getUsuariosController
);

sessiosRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/fail-register",
  }),
  registerUsuarioController
);

sessiosRouter.get("/fail-register", (req, res) => {
  res.status(401).send({ error: "Error al registrarse!" });
});

sessiosRouter.post("/login", loginController);

sessiosRouter.get("/logout", userLogoutController);

sessiosRouter.get("/current", passportCall("jwt"), getUserProfile);

//Delete user
sessiosRouter.delete(
  "/deleteUser/:id",
  passportCall("jwt"),
  authorization("admin"),
  deleteUsuarioController
);

//Put user
sessiosRouter.put(
  "/updateUser/:id",
  passportCall("jwt"),
  authorization("admin"),
  putUsuariosController
);

export default sessiosRouter;
