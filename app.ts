import express, { NextFunction, Request, Response } from "express";
import { authRouter } from "./routes/authRoutes";
import { userRouter } from "./routes/userRoutes";
import listRoutes from "./routes/listRoutes";

export const app = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

//routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/lists", listRoutes);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new Error(`Can't find ${req.url} on this server!`));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 500;
  err.message = err.message || "Something went wrong!";

  res.status(err.status).json({
    status: "error",
    message: err.message,
  });
});
