import { StatusCodes } from "http-status-codes";
import CustomError from "./custom-err";

export default class ForbiddenError extends CustomError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, StatusCodes.FORBIDDEN);
  }
}