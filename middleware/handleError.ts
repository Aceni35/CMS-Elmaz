import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const errors = Object.keys(err.errors).reduce((acc: any, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});

    res.status(400).json({
      msg: "Mongoose validation failed",
      errors,
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    msg: message,
    errors: err.details || null,
  });
};
