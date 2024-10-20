import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import notFound from "./app/middleware/notFound";
import globalErrorHandler from "./app/middleware/globalErrorHandlers";
import cookieParser from "cookie-parser";
import path from "path";

const app: Application = express();

//parser
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://a6-tech-tips-hub.vercel.app"],
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));

//application routes
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
//global error handler
app.use(globalErrorHandler);
//not found
app.use(notFound);

export default app;
