import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Successfully fetched users",
      users: users,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ status: 500, message: "Internal Server Error", success: false });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      status: 200,
      message: "Successfully fetched user",
      user: user,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ status: 500, message: "Internal Server Error", success: false });
  }
};

export const updateUser = [
  body("email").isEmail().withMessage("Username must be a string"),
  body().custom((value, { req }) => {
    const keys = Object.keys(req.body);
    const allowedKeys = ["username", "email", "password"];
    const invalidKeys = keys.filter((key) => !allowedKeys.includes(key));
    if (invalidKeys.length > 0) {
      throw new Error(`Invalid fields: ${invalidKeys.join(", ")}`);
    }
    return true;
  }),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email_params } = req.params;
      const { username, email, password } = req.body;

      let hashedPassword;
      if (password) {
        hashedPassword = await bcrypt.hash(String(password), 10);
      }

      const updatedUser = await prisma.user.update({
        where: { email: email_params },
        data: {
          username,
          email,
          ...(password && { password: hashedPassword }),
        },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });

      res.status(200).json({
        status: 200,
        message: "User updated successfully",
        user: updatedUser,
        success: true,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        success: false,
      });
    }
  },
];
