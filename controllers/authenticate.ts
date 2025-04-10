import { Response, Request } from "express";
import BadRequest from "../errors/BadRequestError";
import { StatusCodes } from "http-status-codes";
import Client from "../models/client";
import Admin from "../models/admin";

export const LogIn = async (req : Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequest("please provide all the credentials");
    }
    const clientUser = await Client.findOne({ email });
    const adminUser = await Admin.findOne({email})
    
    if (!clientUser && ! adminUser) {
      throw new BadRequest("please provide the correct credentials");
    }
    const user = clientUser || adminUser
    const requestedChange = user?.tempPassword.needsChange
    const isValidTime = user?.tempPassword.validUntil! > new Date()
    let isTempMatch = false
    if(requestedChange && isValidTime){
    isTempMatch = await user.matchTemporaryPassword(password)
    }
    const isMatch = await user!.matchPassword(password)
    if (!isMatch && !isTempMatch){
      throw new BadRequest("Invalid credentials");
    }
    const token = user!.createJWT();
    res.status(StatusCodes.OK).json({ msg:"Login successful", token,  firstName : user?.firstName, lastName:user?.lastName, needsPasswordChange :requestedChange});
    }