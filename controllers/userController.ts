import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import { Resend } from "resend";

const TokenGenerator = require("tokgen");

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
      const { username } = req.body;

      try {
        const user = await prisma.user.findUnique({
          where: { email: email_params },
        });

        if (!user) {
          return res.status(404).json({
            status: 404,
            message: "User not found",
            success: false,
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
          status: 500,
          message: "Internal Server Error",
          success: false,
        });
      }

      const updatedUser = await prisma.user.update({
        where: { email: email_params },

        data: {
          username,
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

export const sendTokenPassword = async (req: Request, res: Response) => {
  let generator = new TokenGenerator({ chars: "0-9a-f", length: 6 });
  let token = generator.generate();
  const resend = new Resend(process.env.RESNED_API_KEY);
  const { email, username } = req.body;
  const { data, error } = await resend.emails.send({
    from: "Movix <onboarding@resend.dev>",
    to: [email],
    subject: "Password Reset",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #04152d">
      <h2 style="color: white; font-weight: bold">Hello ${username} ! </h2>
      <p style="font-size: 16px; color: white;">
        We have received a request to reset your password. Please use the following token to change your password:
      </p>
      <div style="text-align: center; margin: 20px 0; color: white;">
        <span style="display: inline-block; padding: 10px 20px; font-size: 18px; color: #fff; background-color: #d9534f;; border-radius: 5px;">${token}</span>
      </div>
      <p style="font-size: 16px; color: white;">
        If you did not request this change, you can ignore this email.
      </p>
      <p style="font-size: 16px; color: white;">
        Thank you,<br>
        The Movix Team
      </p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      <p style="font-size: 12px; color: white;">
        If you have any questions, feel free to <a href="mailto:support@movix.com" style="color: #d9534f;">contact us</a>.
      </p>
    </div>
  `,
  });
  if (error) {
    return res.status(400).json({ error });
  } else {
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        passwordResetToken: token,
      },
    });
    res.status(200).json({ data });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
    },
  });

  if (!user) {
    return res.status(400).json({
      status: 400,
      message: "Invalid token",
      success: false,
    });
  } else {
    const hashedPassword = await bcrypt.hash(String(password), 10);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Password updated successfully",
      success: true,
    });
  }
};
