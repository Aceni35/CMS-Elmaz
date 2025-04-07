import { Request, Response } from "express";
import BadRequest from "../errors/BadRequestError";
import Tag from "../models/tags";
import { StatusCodes } from "http-status-codes";
import { tagExists } from "../helpers/helperFunctions";

export const createTag = async (req: Request, res:Response)=>{
    const {name} = req.body
    if(!name){
        throw new BadRequest("Please provide tag name")
    }
    const newTag = await Tag.create({name})
    res.status(StatusCodes.CREATED).json({msg:"tag created", newTag})
}

export const deleteTag = async (req: Request, res: Response)=>{
    const {tagId} = req.body
    if(!tagId){
        throw new BadRequest("Please provide tag id")
    }
    const exists = await  tagExists(tagId)
    if(!exists){
        throw new BadRequest("Tag does not exist")
    }
    await Tag.findByIdAndDelete({_id:tagId})
    res.status(StatusCodes.OK).json({msg:"tag deleted"})
}

export const updateTag = async (req: Request, res: Response)=>{
    const {tagId, newName} = req.body
    if(!tagId || !newName){
        throw new BadRequest("Please provide both tag id and updated name")
    }
    const exists = await tagExists(tagId)
    if(!exists){
        throw new BadRequest("Tag does not exist")
    }
    const newTag = await Tag.findByIdAndUpdate({_id:tagId} , {name:newName}, {new:true})
    res.status(StatusCodes.OK).json({msg:"tag updated", newTag})
}


export const getAllTags = async (req: Request, res: Response) => {
    const {
      search,
      sort = "createdAt",
      order = "desc",
      limit = "10",
      page = "1"
    } = req.query;
  
    const query: any = {};
  
    if (search && typeof search === "string") {
      const regex = new RegExp(search, "i");
      query.name = regex;
    }
  
    const limitNum = Math.max(1, parseInt(limit as string));
    const pageNum = Math.max(1, parseInt(page as string));
    const skip = (pageNum - 1) * limitNum;
    const sortField = sort.toString();
    const sortOrder = order === "asc" ? sortField : `-${sortField}`;
  
    const tags = await Tag.find(query)
      .sort(sortOrder)
      .skip(skip)
      .limit(limitNum);
  
    const total = await Tag.countDocuments(query);
  
    res.status(StatusCodes.OK).json({
      count: tags.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      tags,
    });
  };