import express from "express";
import { protect } from "../controllers/authController";
import {
  addMovie,
  getMovieByAPIId,
  removeMovie,
} from "../controllers/movieController";
import methodNotAllowed from "../middleware/methodNotAllowed";

const movieRouter = express.Router();

movieRouter.use(protect);
movieRouter.route("/").post(addMovie);
movieRouter.route("/:id").delete(removeMovie);
movieRouter.route("/:id").get(getMovieByAPIId);

movieRouter.all("/", methodNotAllowed(["POST"]));
movieRouter.all("/:id", methodNotAllowed(["DELETE"]));
movieRouter.all("/:id", methodNotAllowed(["GET"]));

export default movieRouter;
