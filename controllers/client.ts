import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequest from "../errors/BadRequestError";
import { clientInputSchema } from "../validators/clientValidator";
import Client from "../models/client";
import { emailInUse, hasPermission, userExists } from "../helpers/helperFunctions";
import Admin from "../models/admin";
import ForbiddenError from "../errors/ForbiddenError";
import { saveChange } from "./admin";

export const createClient = async (req : Request, res: Response) =>{
    const adminUser = await Admin.findById({_id:req.user?.userId})
    const obj = Object.fromEntries(adminUser?.permissions ?? [])
    if(!hasPermission("clients","add",adminUser?.role!, obj)){
        throw new ForbiddenError()
    }
    const parsed = await clientInputSchema().safeParseAsync(req.body)
    if(!parsed.success){
        throw new BadRequest("Zod validation failed", parsed.error.flatten().fieldErrors);
    }
    if(await emailInUse(parsed.data.email!)){
        throw new BadRequest("Email already in use");
    }
    await saveChange(req.user?.userId!, "clients","add")
    const newClient = await Client.create(parsed.data);
      res.status(StatusCodes.CREATED).json({
        message:"Client created",
        newClient
      })
}

export const updateClient = async (req : Request, res : Response)=>{
    const {clientToUpdateId, update} = req.body
    if(!clientToUpdateId || !update){
        throw new BadRequest("Please provide all the required data")
    }
    const exists = await userExists(clientToUpdateId)
    if(!exists){
        throw new BadRequest('User does not exist')
    }
    const adminUser = await Admin.findById({_id:req.user?.userId!})
    const obj = Object.fromEntries(adminUser?.permissions ?? [])
    if(!hasPermission('clients','update', adminUser?.role!,obj)){
      throw new ForbiddenError()
    }
    const parsed = await clientInputSchema(true).safeParseAsync(update)
    if(!parsed.success){
      throw new BadRequest("Zod validation failed", parsed.error.flatten().fieldErrors);
  }
    const newUser = await Client.findByIdAndUpdate({_id:clientToUpdateId},{...parsed.data}, {new:true})
    await saveChange(req.user?.userId!, "clients", "update")
    res.status(StatusCodes.OK).json({msg:"Client updated",newUser})
  }

export const getAllClients = async (req: Request, res: Response) => {
  const {
    search,
    area,
    type,
    company,
    sort = "createdAt",
    order = "desc",
    limit = "10",
    page = "1"
  } = req.query;

  const query: any = {};

  if (search && typeof search === "string") {
    const regex = new RegExp(search, "i");
    query.$or = [
      { firstName: regex },
      { lastName: regex },
      { email: regex }
    ];
  }

  if (area) query.area = area;
  if (type) query.type = type;
  if (company) query.company = company;

  const limitNum = Math.max(1, parseInt(limit as string));
  const pageNum = Math.max(1, parseInt(page as string));
  const skip = (pageNum - 1) * limitNum;

  const sortOrder = order === "asc" ? sort : `-${sort}`;

  const clients = await Client.find(query)
    .select("-password")
    .sort(sortOrder as string)
    .skip(skip)
    .limit(limitNum);

  const total = await Client.countDocuments(query);

  res.status(StatusCodes.OK).json({
    count: clients.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    clients
  });
};
