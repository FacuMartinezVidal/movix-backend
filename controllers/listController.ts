import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { body, param, validationResult } from "express-validator";

const prisma = new PrismaClient();

export const addToFavorites = [
  body("userId").isInt().withMessage("User ID must be an integer"),
  body("movieId").isInt().withMessage("Movie ID must be an integer"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, movieId } = req.body;

    try {
      const favorite = await prisma.favorite.create({
        data: {
          userId,
          movieId,
        },
      });

      res.status(201).json({
        status: 201,
        message: "Movie added to favorites",
        favorite,
        success: true,
      });
    } catch (error) {
      console.error("Error adding to favorites:", error);
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        success: false,
      });
    }
  },
];

export const removeFromFavorites = [
  param("id").isInt().withMessage("Favorite ID must be an integer"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    try {
      await prisma.favorite.delete({
        where: { id: Number(id) },
      });

      res.status(200).json({
        status: 200,
        message: "Movie removed from favorites",
        success: true,
      });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        success: false,
      });
    }
  },
];

export const addToWatchlist = [
  body("userId").isInt().withMessage("User ID must be an integer"),
  body("movieId").isInt().withMessage("Movie ID must be an integer"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, movieId } = req.body;

    try {
      const watchlist = await prisma.watchlist.create({
        data: {
          userId,
          movieId,
        },
      });

      res.status(201).json({
        status: 201,
        message: "Movie added to watchlist",
        watchlist,
        success: true,
      });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        success: false,
      });
    }
  },
];

export const removeFromWatchlist = [
  param("id").isInt().withMessage("Watchlist ID must be an integer"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    try {
      await prisma.watchlist.delete({
        where: { id: Number(id) },
      });

      res.status(200).json({
        status: 200,
        message: "Movie removed from watchlist",
        success: true,
      });
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        success: false,
      });
    }
  },
];

export const addToWatched = [
  body("userId").isInt().withMessage("User ID must be an integer"),
  body("movieId").isInt().withMessage("Movie ID must be an integer"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, movieId } = req.body;

    try {
      const watched = await prisma.watched.create({
        data: {
          userId,
          movieId,
        },
      });

      res.status(201).json({
        status: 201,
        message: "Movie added to watched",
        watched,
        success: true,
      });
    } catch (error) {
      console.error("Error adding to watched:", error);
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        success: false,
      });
    }
  },
];

export const removeFromWatched = [
  param("id").isInt().withMessage("Watched ID must be an integer"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    try {
      await prisma.watched.delete({
        where: { id: Number(id) },
      });

      res.status(200).json({
        status: 200,
        message: "Movie removed from watched",
        success: true,
      });
    } catch (error) {
      console.error("Error removing from watched:", error);
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        success: false,
      });
    }
  },
];
