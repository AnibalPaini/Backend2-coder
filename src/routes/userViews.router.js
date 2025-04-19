import { Router } from "express";
import cookieParser from "cookie-parser";
import { passportCall, authorization } from "../utils.js";

const usersViewRouter = Router();

usersViewRouter.get("/login", (req, res) => {
  res.render("login");
});

usersViewRouter.get("/register", (req, res) => {
  res.render("register");
});

usersViewRouter.get("/", passportCall("jwt"), (req, res) => {
  res.render("profile", {
    user: req.user,
  });
});

usersViewRouter.get(
  "/admin",
  passportCall("jwt"),
  authorization("admin"), //Rol del usuario
  (req, res) => {
    res.render("admin", {
      user: req.user,
    });
  }
);

usersViewRouter.get("/error", (req, res) => {
  res.render("error");
});

export default usersViewRouter;
