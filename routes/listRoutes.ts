import express from "express";
import {
  addToFavorites,
  addToWatched,
  addToWatchlist,
  removeFromFavorites,
  removeFromWatched,
  removeFromWatchlist,
} from "../controllers/listController";
import { protect } from "../controllers/authController";

const router = express.Router();
router.use(protect);
router.post("/favorites", addToFavorites);
router.post("/watchlist", addToWatchlist);
router.post("/watched", addToWatched);
router.delete("/favorites/:id", removeFromFavorites);
router.delete("/watchlist/:id", removeFromWatchlist);
router.delete("/watched/:id", removeFromWatched);

export default router;
