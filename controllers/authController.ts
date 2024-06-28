import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();

export const register = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { username, password, email } = req.body;

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existingUser) {
        return res.status(400).json({
          status: 400,
          message: "User or email already exists!",
          success: false,
        });
      }

      const hashedPassword = await bcrypt.hash(String(password), 10);

      const newUser = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          email,
        },
      });

      const userDTO = {
        username: newUser.username,
        email: newUser.email,
      };

      res.status(201).json({
        status: 201,
        message: "Successfully Created",
        user: userDTO,
        success: true,
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({
        status: 400,
        message: "Error registering user",
        success: false,
      });
    }
  },
];
export const login = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password").notEmpty().withMessage("Password is required"),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: 400,
          message: "All fields are required",
          success: false,
        });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res
          .status(401)
          .json({
            status: 400,
            message: "Invalid Credentials",
            success: false,
          });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({
            status: 400,
            message: "Invalid Credentials",
            success: false,
          });
      }
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not found in .env file");
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      );

      res.status(200).setHeader("Authorization", `Bearer ${token}`).json({
        status: 200,
        message: "Successfully login!",
        success: true,
      });
    } catch (error) {
      console.error("Error en login:", error);
      res
        .status(500)
        .json({
          status: 500,
          message: "Internal Server Error",
          success: false,
        });
    }
  },
];

interface UserDTO {
  id: string;
  username: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserDTO;
    }
  }
}

interface JwtPayload {
  userId: string;
  email: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not found in .env file");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

      if (!decoded || !decoded.userId) {
        return res
          .status(401)
          .json({ message: "Not authorized, token failed" });
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, username: true, email: true },
      });

      if (!user) {
        return res
          .status(401)
          .json({ message: "Not authorized, token failed" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }
};
