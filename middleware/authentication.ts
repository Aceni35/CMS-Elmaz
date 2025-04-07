import { NextFunction, Request, Response } from "express";
import BadRequest from "../errors/BadRequestError";

const jwt = require("jsonwebtoken");

interface AuthenticatedRequest extends Request {
    user?: {
      userId: string;
    };
  }

export const checkAuth = async (req : AuthenticatedRequest, res : Response, next : NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new BadRequest("Authorization Invalid");
  }
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId};
    next();
  } catch (error) {
    throw new BadRequest("JWT authorization Invalid");
  }
};