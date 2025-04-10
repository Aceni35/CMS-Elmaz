import { Request, Response } from "express";
import { hasPermission, newsExists } from "../helpers/helperFunctions";
import Admin from "../models/admin";
import ForbiddenError from "../errors/ForbiddenError";
import News from "../models/news";
import { StatusCodes } from "http-status-codes";
import BadRequest from "../errors/BadRequestError";
import { saveChange } from "./admin";
import { filesDelete } from "./uploadcareFiles";

export const createNews = async (req : Request,res: Response) =>{
const adminUser=  await Admin.findById({_id:req.user?.userId})
  const obj = Object.fromEntries(adminUser?.permissions ?? [])
  if(!hasPermission('news','add', adminUser?.role!,obj)){
    throw new ForbiddenError()
  }
  const newArticle = await News.create({...req.body, createdBy:{fullName: `${adminUser?.firstName} ${adminUser?.lastName}`, id:adminUser?._id}, views:[]})
  await saveChange(req.user?.userId!, "news","add")
  res.status(StatusCodes.CREATED).json({msg:"News article created", newArticle})
}

export const deleteNews = async (req: Request, res: Response)=>{
    const {newsId} = req.body
    const adminUser = await Admin.findById({_id:req.user?.userId!})
    const obj = Object.fromEntries(adminUser?.permissions!)
    if(!newsId){
        throw new BadRequest("Please provide the news id")
    }
    if(!hasPermission('news','delete', adminUser?.role!,obj)){
        throw new ForbiddenError()
    }
    const exists = await newsExists(newsId)
    if(!exists){
        throw new BadRequest("News article does not exist")
    }
    const files = (await News.findById({_id:newsId}))?.images
    await filesDelete(files ?? [])
    await News.findOneAndDelete({_id:newsId})
    await saveChange(req.user?.userId!, "news","delete")
    res.status(StatusCodes.OK).json({msg:"news deleted"})
}

export const editNews = async (req: Request, res: Response) =>{
    const {newsId} = req.body
    const adminUser = await Admin.findById({_id:req.user?.userId!})
    const obj = Object.fromEntries(adminUser?.permissions!)
    if(!newsId){
        throw new BadRequest("Please provide the news id")
    }
    if(!hasPermission('news',"update", adminUser?.role!,obj)){
        throw new ForbiddenError()
    }
    const exists = await newsExists(newsId)
    if(!exists){
        throw new BadRequest("News article does not exist")
    }
    const updates: Record<string, any> = {};
    const updatableFields = ["cover", "title", "content", "tagIds", "images", "status"];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    if(!Object.keys(updates).length){
        throw new BadRequest("Pleas provide new updates")
    }
    const newArticle = await News.findByIdAndUpdate({_id:newsId},{...updates},{new:true})
    await saveChange(req.user?.userId!, "news","update")
    res.status(StatusCodes.OK).json({msg:"news updated", newArticle})
}


export const getAllNews = async (req: Request, res: Response) => {
  const {
    search,
    status,
    createdBy,
    tag,
    month,
    year,
    sort = "createdAt",
    order = "desc",
    limit = "10",
    page = "1",
  } = req.query;

  const query: any = {};

  if (search && typeof search === "string") {
    const regex = new RegExp(search, "i");
    query.$or = [{ title: regex }, { "createdBy.fullName": regex }];
  }

  if (status && ["active", "draft", "archive"].includes(status as string)) {
    query.status = status;
  }

  if (createdBy) {
    query["createdBy.id"] = createdBy;
  }

  if (tag && typeof tag === "string") {
    query.tagIds = tag;
  }

  if (year) {
    const yearInt = parseInt(year as string);
    const monthInt = month ? parseInt(month as string) - 1 : undefined;

    let from: Date;
    let to: Date;

    if (monthInt !== undefined) {
      from = new Date(yearInt, monthInt, 1);
      to = new Date(yearInt, monthInt + 1, 0, 23, 59, 59, 999);
    } else {
      from = new Date(yearInt, 0, 1);
      to = new Date(yearInt, 11, 31, 23, 59, 59, 999);
    }

    query.createdAt = { $gte: from, $lte: to };
  }

  const limitNum = Math.max(1, parseInt(limit as string));
  const pageNum = Math.max(1, parseInt(page as string));
  const skip = (pageNum - 1) * limitNum;

  const sortField = sort.toString();
  const sortOrder = order === "asc" ? sortField : `-${sortField}`;

  const news = await News.find(query)
    .sort(sortOrder)
    .skip(skip)
    .limit(limitNum);

  const total = await News.countDocuments(query);
  await saveChange(req.user?.userId!, "news","view")
  res.status(StatusCodes.OK).json({
    count: news.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    news,
  });
};

export const getPopularNewsThisMonth = async (req: Request, res: Response) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
    const news = await News.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      }
    })
      .sort({ "views.length": -1 })
      .limit(5);
    await saveChange(req.user?.userId!, "news","view")
    res.status(StatusCodes.OK).json({
      popular: news.length,
      news,
    });
  };

export const saveView = async (newsId:string, userId:string)=>{
  const news = await News.findOne({_id:newsId})
  if(!news)return
  news.views.push({
    userId,
    viewedAt: new Date(),
  });
  await news.save()
}

export const getSingleNews = async (req:Request, res:Response)=>{
  const newsId = req.params.id
  if(!newsId){
    throw new BadRequest("Please provide news id")
  }
  const exists = await newsExists(newsId)
  if(!exists){
    throw new BadRequest("News article does not exist")
  }
  const news = await News.findById({_id:newsId})
  await saveView(newsId, req.user?.userId!)
  res.status(StatusCodes.OK).json({news})
}