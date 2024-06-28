import express from "express";
import { protect } from "../controllers/authController";
import {
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/userController";

export const userRouter = express.Router();

userRouter.use(protect);
userRouter.route("/").get(getAllUsers);
userRouter.route("/:id").get(getUserById);
userRouter.route("/:id").put(updateUser);
