import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();

export const addToFavorites = [
  body("userId").isString().withMessage("User ID must be an integer"),
  body("id").isInt().withMessage("Movie ID must be an integer"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, id } = req.body;

    try {
      const existingFavorite = await prisma.favorite.findFirst({
        where: {
          userId,
          api_id: id,
        },
      });

      if (existingFavorite) {
        return res.status(400).json({
          status: 400,
          message: "Movie already in favorites",
          success: false,
        });
      }

      const favorite = await prisma.favorite.create({
        data: {
          userId,
          api_id: id,
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
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, api_id } = req.params;

    try {
      const existingFavorite = await prisma.favorite.findFirst({
        where: {
          userId,
          api_id: Number(api_id),
        },
      });

      if (existingFavorite === null) {
        return res.status(404).json({
          status: 404,
          message: "Favorite not found",
          success: false,
        });
      }

      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
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
  body("userId").isString().withMessage("User ID must be an integer"),
  body("id").isInt().withMessage("Movie ID must be an integer"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, id } = req.body;

    try {
      const existingWatchlist = await prisma.watchlist.findFirst({
        where: {
          userId,
          api_id: id,
        },
      });

      if (existingWatchlist) {
        return res.status(400).json({
          status: 400,
          message: "Movie already in watchlist",
          success: false,
        });
      }
      const watchlist = await prisma.watchlist.create({
        data: {
          userId,
          api_id: Number(id),
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
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, api_id } = req.params;

    try {
      const existingWatchlist = await prisma.watchlist.findFirst({
        where: {
          userId,
          api_id: Number(api_id),
        },
      });

      if (existingWatchlist === null) {
        return res.status(404).json({
          status: 404,
          message: "Favorite not found",
          success: false,
        });
      }

      await prisma.watchlist.delete({
        where: {
          id: existingWatchlist.id,
        },
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
  body("userId").isString().withMessage("User ID must be an integer"),
  body("id").isInt().withMessage("Movie ID must be an integer"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, id } = req.body;

    try {
      const existingWatched = await prisma.watched.findFirst({
        where: {
          userId,
          api_id: Number(id),
        },
      });

      if (existingWatched) {
        return res.status(400).json({
          status: 400,
          message: "Movie already in watched list",
          success: false,
        });
      }

      const watched = await prisma.watched.create({
        data: {
          userId,
          api_id: Number(id),
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
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, api_id } = req.params;
    console.log(userId, api_id);
    try {
      const existingWatched = await prisma.watched.findFirst({
        where: {
          userId,
          api_id: Number(api_id),
        },
      });

      if (existingWatched === null) {
        return res.status(404).json({
          status: 404,
          message: "Favorite not found",
          success: false,
        });
      }
      await prisma.watched.delete({
        where: {
          id: existingWatched.id,
        },
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

export const getWatchList = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const watchList = await prisma.watchlist.findMany({
      where: { userId },
      include: {
        movie: {
          select: {
            id: true,
            api_id: true,
            title: true,
            original_title: true,
            overview: true,
            poster_path: true,
            backdrop_path: true,
            genre_ids: true,
            vote_average: true,
            vote_count: true,
            release_date: true,
            popularity: true,
            adult: true,
            original_language: true,
            video: true,
          },
        },
      },
    });
    res.status(200).json(watchList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching watchlist", error });
  }
};

export const getWatchedList = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const watchedList = await prisma.watched.findMany({
      where: { userId },
      include: {
        movie: {
          select: {
            id: true,
            api_id: true,
            title: true,
            original_title: true,
            overview: true,
            poster_path: true,
            backdrop_path: true,
            genre_ids: true,
            vote_average: true,
            vote_count: true,
            release_date: true,
            popularity: true,
            adult: true,
            original_language: true,
            video: true,
          },
        },
      },
    });
    res.status(200).json(watchedList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching watched list", error });
  }
};

export const getFavoritesList = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const favoritesList = await prisma.favorite.findMany({
      where: { userId },
      include: {
        movie: {
          select: {
            id: true,
            api_id: true,
            title: true,
            original_title: true,
            overview: true,
            poster_path: true,
            backdrop_path: true,
            genre_ids: true,
            vote_average: true,
            vote_count: true,
            release_date: true,
            popularity: true,
            adult: true,
            original_language: true,
            video: true,
          },
        },
      },
    });
    res.status(200).json(favoritesList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorites list", error });
  }
};
