import { Request, Response } from "express";
import Admin from "../models/admin";
import { documentExists, hasPermission } from "../helpers/helperFunctions";
import ForbiddenError from "../errors/ForbiddenError";
import DocumentModel from "../models/documents";
import { StatusCodes } from "http-status-codes";
import { saveChange } from "./admin";
import BadRequest from "../errors/BadRequestError";
import { documentInputSchema } from "../validators/documents";

export const createDocument = async (req:Request, res:Response)=>{
    const adminUser= await Admin.findById({_id:req.user?.userId!})
      const obj = Object.fromEntries(adminUser?.permissions!)
      if(!hasPermission('documents','add', adminUser?.role!,obj)){
        throw new ForbiddenError()
      }
    const parsed = documentInputSchema().safeParse(req.body)
    if(!parsed.success){
    throw new BadRequest("Zod validation failed", parsed.error.flatten().fieldErrors);
    }
    const newDocument = await DocumentModel.create(parsed.data)
    await saveChange(req.user?.userId!, "documents","add")
    res.status(StatusCodes.CREATED).json({msg:"Document Created", newDocument})
}

export const deleteDocument = async (req: Request, res:Response)=>{
    const {documentId} = req.body
    const exists = await documentExists(documentId)
    if(!exists){
        throw new BadRequest("Document does not exist")
    }
    const adminUser= await Admin.findById({_id:req.user?.userId!})
    const obj = Object.fromEntries(adminUser?.permissions!)
    if(!hasPermission('documents','delete', adminUser?.role!,obj)){
      throw new ForbiddenError()
    }
    await DocumentModel.findByIdAndDelete({_id:documentId})
    await saveChange(req.user?.userId!, "documents","delete")
    res.status(StatusCodes.OK).json({msg:"Document deleted"})
}

export const editDocument = async (req:Request, res:Response)=>{
    const adminUser= await Admin.findById({_id:req.user?.userId!})
      const obj = Object.fromEntries(adminUser?.permissions!)
      if(!hasPermission('documents','update', adminUser?.role!,obj)){
        throw new ForbiddenError()
      }
    const {documentId} = req.body
    const exists = await documentExists(documentId)
    if(!exists){
        throw new BadRequest("Document does not exist")
    }
    const parsed = documentInputSchema(true).safeParse(req.body)
    if(!parsed.success){
    throw new BadRequest("Zod validation failed", parsed.error.flatten().fieldErrors);
    }
    const newDocument = await DocumentModel.findByIdAndUpdate({_id:documentId},{...parsed.data},{new:true})
    await saveChange(req.user?.userId!, "documents","update")
    res.status(StatusCodes.CREATED).json({msg:"Document updated", newDocument})
}