import express from "express";
import { protect } from "../controllers/authController";
import {
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/userController";
import methodNotAllowed from "../middleware/methodNotAllowed";

export const userRouter = express.Router();

userRouter.use(protect);
userRouter.route("/").get(getAllUsers);
userRouter.route("/:id").get(getUserById);
userRouter.route("/email/:email_params").put(updateUser);
userRouter.all("/", methodNotAllowed(["GET"]));
userRouter.all("/:id", methodNotAllowed(["GET"]));
userRouter.all("/email/:email_params", methodNotAllowed(["PUT"]));
