import { NextFunction, Request, Response } from "express";

const methodNotAllowed = (allowedMethods: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedMethods.includes(req.method)) {
      res.status(405).json({
        status: 405,
        message: `Method ${req.method} Not Allowed`,
        success: false,
      });
    } else {
      next();
    }
  };
};

export default methodNotAllowed;
