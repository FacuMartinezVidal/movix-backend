import express from "express";
import { login, register } from "../controllers/authController";
import methodNotAllowed from "../middleware/methodNotAllowed";

export const authRouter = express.Router();

authRouter.route("/register").post(register);
authRouter.route("/login").post(login);
authRouter.all("/register", methodNotAllowed(["POST"]));
authRouter.all("/login", methodNotAllowed(["POST"]));
