import * as express from "express";
import { Request, Response, NextFunction } from "express";
import { apiPort } from "../../settings/setting";
import { cors } from "./lib.cors";
import { apiRoutes } from "./api/routes";
import { HttpError } from "http-errors";
import { StatusCodes } from "http-status-codes";
import * as createError from "http-errors";
const app = express();

app.use(cors);

// 100mb on body instead of  100kb (default)//
app.use(express.json({ limit: 100 * 1024 * 1024 }));

app.use(apiRoutes);

//  Create Errors and send it to  error handling middleware  //

app.use((req: Request, res: Response, next: NextFunction) => {
  throw createError(StatusCodes.NOT_IMPLEMENTED, "Not implemented");
});

//  Global error handling middleware  //
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const code = error.StatusCodes || StatusCodes.INTERNAL_SERVER_ERROR;
  const message =
    code === StatusCodes.INTERNAL_SERVER_ERROR ? "Server Error" : error.message;
  res.status(code).json({
    code,
    data: { errors: error.errors },
    message: message,
    error: error.message || message,
  });
});

//start the Express Server
const server = app.listen(apiPort, () => {
  console.log(`Server started successfully at http://localhost:3000`);
});

// handling errors, that  come from outside express
process.on(`unhandledRejection `, (err) => {
  console.error(`unhandledRejection Error: ${err}`);
  server.close(() => {
    console.error(`Shuutting Down ..........`);
    process.exit(1);
  });
});
