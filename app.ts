import express, { Express, NextFunction, Request, Response } from "express";
import { authRouter } from "./routes/authRoutes";
import { userRouter } from "./routes/userRoutes";
import listRoutes from "./routes/listRoutes";
import movieRouter from "./routes/movieRoutes";
import cors from "cors";

export const app: Express = express();
const allowedOrigins = ["http://localhost:5173"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  }),
);

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

//routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1", listRoutes);
app.use("/api/v1/movies", movieRouter);

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
