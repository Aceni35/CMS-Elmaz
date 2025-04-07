import { Request , Response} from "express";
import { documentExists, hasPermission, invoiceDocumentExists } from "../helpers/helperFunctions";
import Admin from "../models/admin";
import BadRequest from "../errors/BadRequestError";
import { saveChange } from "./admin";
import ForbiddenError from "../errors/ForbiddenError";
import { invoiceDocumentInputSchema } from "../validators/invoiceDocumentValidator";
import InvoiceDocument from "../models/invoiceDocument";
import { StatusCodes } from "http-status-codes";

export const createInvoiceDocument = async (req:Request, res:Response)=>{
    const adminUser= await Admin.findById({_id:req.user?.userId!})
    const obj = Object.fromEntries(adminUser?.permissions!)
    if(!hasPermission('documents','add', adminUser?.role!,obj)){
      throw new ForbiddenError()
    }
  const parsed = invoiceDocumentInputSchema().safeParse(req.body)
  if(!parsed.success){
  throw new BadRequest("Zod validation failed", parsed.error.flatten().fieldErrors);
  }
  const newDocument = await InvoiceDocument.create(parsed.data)
  await saveChange(req.user?.userId!, "documents","add")
  res.status(StatusCodes.CREATED).json({msg:"Invoice Document Created", newDocument})
}

export const deleteInvoiceDocument = async (req: Request, res:Response)=>{
    const {documentId} = req.body
    const exists = await invoiceDocumentExists(documentId)
    if(!exists){
        throw new BadRequest("Document does not exist")
    }
    const adminUser= await Admin.findById({_id:req.user?.userId!})
    const obj = Object.fromEntries(adminUser?.permissions!)
    if(!hasPermission('documents','delete', adminUser?.role!,obj)){
      throw new ForbiddenError()
    }
    await InvoiceDocument.findByIdAndDelete({_id:documentId})
    await saveChange(req.user?.userId!, "documents","delete")
    res.status(StatusCodes.OK).json({msg:"Invoice Document deleted"})
}

export const editInvoiceDocument = async (req:Request, res:Response)=>{
    const adminUser= await Admin.findById({_id:req.user?.userId!})
      const obj = Object.fromEntries(adminUser?.permissions!)
      if(!hasPermission('documents','update', adminUser?.role!,obj)){
        throw new ForbiddenError()
      }
    const {documentId} = req.body
    const exists = await invoiceDocumentExists(documentId)
    if(!exists){
        throw new BadRequest("Document does not exist")
    }
    const parsed = invoiceDocumentInputSchema(true).safeParse(req.body)
    if(!parsed.success){
    throw new BadRequest("Zod validation failed", parsed.error.flatten().fieldErrors);
    }
    const newDocument = await InvoiceDocument.findByIdAndUpdate({_id:documentId},{...parsed.data},{new:true})
    await saveChange(req.user?.userId!, "documents","update")
    res.status(StatusCodes.CREATED).json({msg:"Invoice Document updated", newDocument})
}