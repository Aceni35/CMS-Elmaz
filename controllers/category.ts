import { Request, Response } from "express";
import Category from "../models/category";
import { StatusCodes } from "http-status-codes";
import { categoryInputSchema } from "../validators/categoryValidator";
import BadRequest from "../errors/BadRequestError";
import { categoryExists } from "../helpers/helperFunctions";

export const createCategory = async (req: Request, res:Response)=>{
    console.log('runs  2');
    const parsed = categoryInputSchema().safeParse(req.body)
    console.log('runs');
    
    if(!parsed.success){
    throw new BadRequest("Zod validation failed", parsed.error.flatten().fieldErrors);
    }
    const newCategory = await Category.create({...parsed.data})
    res.status(StatusCodes.CREATED).json({msg:"category created", newCategory})
}

export const updateCategory = async(req:Request, res:Response)=>{ 
    const {categoryId} = req.body
    const exists= await categoryExists(categoryId)
    if(!exists){
    throw new BadRequest("Category does not exist")
    }
    const parsed = categoryInputSchema(true).safeParse(req.body)
    if(!parsed.success){
    throw new BadRequest("Zod validation failed", parsed.error.flatten().fieldErrors);
    }
    const newCategory = await Category.findByIdAndUpdate({_id:categoryId},{...parsed.data},{new:true})
    res.status(StatusCodes.OK).json({msg:"category updated", newCategory})
}

export const deleteCategory = async(req:Request, res:Response)=>{
    const {categoryId} = req.body
    if(!categoryId){
        throw new BadRequest("Please provide category id")
    }
    const exists = await categoryExists(categoryId)
    if(!exists){
        throw new BadRequest("Category does not exist")
    }
    await Category.findByIdAndDelete({_id:categoryId})
    res.status(StatusCodes.OK).json({msg:"category deleted"})
}