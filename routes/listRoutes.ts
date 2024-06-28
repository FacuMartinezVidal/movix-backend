import express from "express";
import {
  addToFavorites,
  addToWatched,
  addToWatchlist,
  getFavoritesList,
  getWatchedList,
  getWatchList,
  removeFromFavorites,
  removeFromWatched,
  removeFromWatchlist,
} from "../controllers/listController";
import { protect } from "../controllers/authController";
import methodNotAllowed from "../middleware/methodNotAllowed";

const listRouter = express.Router();
listRouter.use(protect);

listRouter.post("/favorites", addToFavorites);
listRouter.delete("/favorites/:userId/:api_id", removeFromFavorites);
listRouter.all("/favorites", methodNotAllowed(["POST"]));
listRouter.all("/favorites/:userId/:api_id", methodNotAllowed(["DELETE"]));

listRouter.post("/watchlist", addToWatchlist);
listRouter.delete("/watchlist/:userId/:api_id", removeFromWatchlist);
listRouter.all("/watchlist", methodNotAllowed(["POST"]));
listRouter.all("/watchlist/:userId/:api_id", methodNotAllowed(["DELETE"]));

listRouter.post("/watched", addToWatched);
listRouter.delete("/watched/:userId/:api_id", removeFromWatched);
listRouter.all("/watched", methodNotAllowed(["POST"]));
listRouter.all("/watched/:userId/:api_id", methodNotAllowed(["DELETE"]));

listRouter.route("/watchlist/:userId").get(protect, getWatchList);
listRouter.all("/watchlist/:userId", methodNotAllowed(["GET"]));
listRouter.route("/watched/:userId").get(protect, getWatchedList);
listRouter.all("/watched/:userId", methodNotAllowed(["GET"]));
listRouter.route("/favorites/:userId").get(protect, getFavoritesList);
listRouter.all("/favorites/:userId", methodNotAllowed(["GET"]));

export default listRouter;
