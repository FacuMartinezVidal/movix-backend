import express from "express";
import { login, register } from "../controllers/authController";

export const authRouter = express.Router();

authRouter.route("/register").post(register);
authRouter.route("/login").post(login);
