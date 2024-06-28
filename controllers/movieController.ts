import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { body, param, validationResult } from "express-validator";

const prisma = new PrismaClient();

export const addMovie = [
  body("title").notEmpty().withMessage("Title is required"),
  body("id").isInt().withMessage("Movie ID must be an integer"),
  body("original_title").notEmpty().withMessage("Original title is required"),
  body("overview").notEmpty().withMessage("Overview is required"),
  body("poster_path").notEmpty().withMessage("Poster path is required"),
  body("backdrop_path").notEmpty().withMessage("Backdrop path is required"),
  body("genre_ids")
    .isArray()
    .withMessage("Genre IDs must be an array of integers"),
  body("vote_average")
    .isFloat({ min: 0, max: 10 })
    .withMessage("Vote average must be between 0 and 10"),
  body("vote_count").isInt().withMessage("Vote count must be an integer"),
  body("release_date")
    .isISO8601()
    .withMessage("Release date must be a valid date"),
  body("popularity").isFloat().withMessage("Popularity must be a float"),
  body("adult").isBoolean().withMessage("Adult must be a boolean"),
  body("original_language")
    .notEmpty()
    .withMessage("Original language is required"),
  body("video").isBoolean().withMessage("Video must be a boolean"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      id,
      original_title,
      overview,
      poster_path,
      backdrop_path,
      genre_ids,
      vote_average,
      vote_count,
      release_date,
      popularity,
      adult,
      original_language,
      video,
    } = req.body;

    try {
      const movie = await prisma.movie.create({
        data: {
          api_id: id,
          title,
          original_title,
          overview,
          poster_path,
          backdrop_path,
          genre_ids,
          vote_average,
          vote_count,
          release_date: new Date(release_date),
          popularity,
          adult,
          original_language,
          video,
        },
      });

      res.status(201).json({
        status: 201,
        message: "Movie added successfully",
        movie,
        success: true,
      });
    } catch (error) {
      console.error("Error adding movie:", error);
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        success: false,
      });
    }
  },
];

export const removeMovie = [
  param("id").isInt().withMessage("Movie ID must be an integer"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, id } = req.params;

    try {
      await prisma.movie.delete({
        where: { api_id: Number(id) },
      });

      res.status(200).json({
        status: 200,
        message: "Movie removed successfully",
        success: true,
      });
    } catch (error) {
      console.error("Error removing movie:", error);
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        success: false,
      });
    }
  },
];

export const getMovieByAPIId = [
  param("id").isInt().withMessage("Movie ID must be an integer"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    try {
      const movie = await prisma.movie.findUnique({
        where: { api_id: Number(id) },
      });

      if (!movie) {
        return res.status(404).json({
          status: 404,
          message: "Movie not found",
          success: false,
        });
      }

      res.status(200).json({
        status: 200,
        movie,
        success: true,
      });
    } catch (error) {
      console.error("Error getting movie:", error);
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        success: false,
      });
    }
  },
];
