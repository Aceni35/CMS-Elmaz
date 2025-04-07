import { Request, Response } from "express";
import { hashPassword, hasPermission,userExists, userType } from "../helpers/helperFunctions";
import Admin from "../models/admin";
import { StatusCodes } from "http-status-codes";
import BadRequest from "../errors/BadRequestError";
import Client from "../models/client";
import { passwordSchema } from "../validators/helperValidators";
import ForbiddenError from "../errors/ForbiddenError";
import { Model } from "mongoose";
import { saveChange } from "./admin";

export const updatePassword = async( req: Request, res:Response)=>{
    const {oldPassword, newPassword} = req.body
    const id  = req.user?.userId!
    if(!oldPassword || !newPassword){
      throw new BadRequest("Please provide all the data needed")
    }
    const adminUser = await Admin.findById({_id:id})
    const clientUser = await Client.findById({_id:id})
    const user = adminUser || clientUser
    const isMatch = await user?.matchPassword(oldPassword)
    if(!isMatch){
      throw new BadRequest("Old password is incorrect")
    }
    const hashedPass = await hashPassword(newPassword)
    const isValid = await passwordSchema.safeParseAsync(newPassword)
    if(!isValid.success){
      throw new BadRequest("Password must be longer than 8 letters")
    }
    if(await userType(id) === "client"){
      await Client.findByIdAndUpdate({_id:id},{password:hashedPass})
    }else{
      await Admin.findByIdAndUpdate({_id:id},{password:hashedPass})
    }
    res.status(StatusCodes.OK).json({msg:"password updated"})
  }

  export const deleteUser = async (req :Request, res: Response )=>{
    const {deleteUserId} = req.body
    const role = await userType(deleteUserId)
    const adminUser = await Admin.findById({_id:req.user?.userId})
    const obj = Object.fromEntries(adminUser?.permissions ?? [])
    console.log(adminUser?.permissions);
    
    if(!hasPermission(role === "client" ? "clients" : 'admins', "delete",adminUser?.role! ,obj )){
      throw new ForbiddenError()
    }
    if (!deleteUserId){
      throw new BadRequest("please provide the id")
    }
    const exist = await userExists(deleteUserId)
    if(!exist){
      throw new BadRequest("User does not exist")
    }
    const userForDeletion : Model<any> = role === "admin" ? Admin : Client
    await userForDeletion.deleteOne({_id:deleteUserId})
    await saveChange(req.user?.userId!,role === "client" ? "clients" : 'admins', "delete" )
    res.status(StatusCodes.OK).json({msg:"User removed"})
  }

export const makeNewPassword = (req:Request, res:Response)=>{
  // create to make new pass here
}