import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { TErrorSources } from "../interface/error";
import handleZodError from "../error/handleZodError";
import handleValidationError from "../error/handleValidationError";
import handleCastError from "../error/handleCastError";
import handleDuplicateError from "../error/handleDuplicateError";
import AppError from "../error/AppError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  {
    //setting default values
    let statusCode = 500;
    let message = "Something went wrong";

    let errorSources: TErrorSources = [
      {
        path: "",
        message: "Something went wrong",
      },
    ];

    if (err instanceof ZodError) {
      const simplifiedZodError = handleZodError(err);
      statusCode = simplifiedZodError?.statusCode;
      message = simplifiedZodError?.message;
      errorSources = simplifiedZodError?.errorSources;
    } else if (err?.name === "ValidationError") {
      const simplifiedValidationError = handleValidationError(err);
      statusCode = simplifiedValidationError.statusCode;
      message = simplifiedValidationError.message;
      errorSources = simplifiedValidationError.errorSources;
    } else if (err?.name === "CastError") {
      const simplifiedCastError = handleCastError(err);
      statusCode = simplifiedCastError.statusCode;
      message = simplifiedCastError.message;
      errorSources = simplifiedCastError.errorSources;
    } else if (err?.code === 11000) {
      const simplifiedCastError = handleDuplicateError(err);
      statusCode = simplifiedCastError.statusCode;
      message = simplifiedCastError.message;
      errorSources = simplifiedCastError.errorSources;
    } else if (err instanceof AppError) {
      statusCode = err.statusCode;
      message = err.message;
      errorSources = [
        {
          path: "",
          message: err?.message,
        },
      ];
    } else if (err instanceof Error) {
      message = err.message;
      errorSources = [
        {
          path: "",
          message: err?.message,
        },
      ];
    }

    //ultimate return
    return res.status(statusCode).json({
      success: false,
      message,
      errorSources,
      stack: err.stack,
    });
  }
};
export default globalErrorHandler;
