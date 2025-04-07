import { NextFunction, Request, Response } from "express";
import ForbiddenError from "../errors/ForbiddenError";
import { userType } from "../helpers/helperFunctions";

 const checkAdmin = async (req : Request, res : Response, next : NextFunction) => {
    const id = req.user!.userId
    const user = await userType(id)
    if(user === "client"){
        throw new ForbiddenError()
    }
    next()
};

export default checkAdmin