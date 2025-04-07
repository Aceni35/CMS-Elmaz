import { Request, Response } from "express";
import { emailInUse, hasPermission, userExists } from "../helpers/helperFunctions";
import ForbiddenError from "../errors/ForbiddenError";
import Admin from "../models/admin";
import { adminInputSchema } from "../validators/adminValidators";
import { StatusCodes } from "http-status-codes";
import BadRequest from "../errors/BadRequestError";
import {PermissionAction, PermissionModule} from "../helpers/helperTypes"
import AdminAction from "../models/adminChange";



export const createAdmin = async (req : Request, res: Response) =>{
    const userId = req.user!.userId
    const adminUser = await Admin.findOne({_id:userId})
    const obj = Object.fromEntries(adminUser?.permissions ?? [])
    if(!hasPermission('admins','add',adminUser?.role!,obj)){
        throw new ForbiddenError("You do not have access to create new Admin")
    }
    const parsed = await adminInputSchema(false).safeParseAsync(req.body)
    if(!parsed.success){
        throw new BadRequest("Zod validation failed", parsed.error.flatten().fieldErrors);
    }
    if(await emailInUse(parsed.data.email!)){
        throw new BadRequest("Email already in use");
    }
    
    if (parsed.data.role === "admin" && !parsed.data.permissions) {
        throw new BadRequest("Permissions are required for Admin users");
      }
    await saveChange(userId, "admins", "add")
    const newAdmin = await Admin.create(parsed.data);
      res.status(StatusCodes.CREATED).json({
        message:"Admin created",
        newAdmin
      })
}

export const updateAdmin = async (req : Request, res : Response)=>{
  const {adminToUpdateId, update} = req.body
  if(!adminToUpdateId || !update){
      throw new BadRequest("Please provide all the required data")
  }
  const exists = await userExists(adminToUpdateId)
  if(!exists){
    throw new BadRequest('User does not exist')
  }
  const adminUser = await Admin.findById({_id:req.user?.userId!})
  const obj = Object.fromEntries(adminUser?.permissions ?? [])
  if(!hasPermission('admins','update', adminUser?.role!,obj)){
    throw new ForbiddenError()
  }
  const parsed = await adminInputSchema(true).safeParseAsync(update)
  if(!parsed.success){
    throw new BadRequest("Zod validation failed", parsed.error.flatten().fieldErrors);
}
  const newUser = await Admin.findByIdAndUpdate({_id:adminToUpdateId},{...parsed.data}, {new:true})
  await saveChange(req.user?.userId!, "admins", "update")
  res.status(StatusCodes.OK).json({msg:"admin updated",newUser})
}


export const getAllAdmins = async (req: Request, res: Response) => {
  const { role, search, sort = "createdAt", order = "desc", limit = "10", page = "1" } = req.query;

  const query: any = {};

  if (role && (role === "admin" || role === "super_admin")) {
    query.role = role;
  }

  if (search && typeof search === "string") {
    const regex = new RegExp(search, "i");
    query.$or = [
      { firstName: regex },
      { lastName: regex },
      { email: regex }
    ];
  }

  const limitNum = Math.max(1, parseInt(limit as string));
  const pageNum = Math.max(1, parseInt(page as string));
  const skip = (pageNum - 1) * limitNum;

  const sortOrder = order === "asc" ? sort : `-${sort}`;
console.log(sortOrder);


  const admins = await Admin.find(query)
    .select("-password")
    .sort(sortOrder as string)
    .skip(skip)
    .limit(limitNum);

  const total = await Admin.countDocuments(query);

  res.status(StatusCodes.OK).json({
    count: admins.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    admins
  });
};

export const getSingleAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const adminUser = await Admin.findById({_id:req.user?.userId!})
  const obj = Object.fromEntries(adminUser?.permissions!)
  if(!hasPermission('admins','view', adminUser?.role!,obj)){
    throw new ForbiddenError()
  }
  const admin = await Admin.findById(id).select("-password");
  if (!admin) {
    throw new BadRequest(`No admin found with id: ${id}`);
  }
  await saveChange(req.user?.userId!, "admins","view")
  res.status(StatusCodes.OK).json({ admin });
};

export const saveChange = async (adminId :string, module:PermissionModule, action:PermissionAction ) =>{
  if (!adminId || ! module || !action){
    throw new BadRequest("Couldn't save action")
  }
  console.log(adminId, module, action);
  
  await AdminAction.create({adminId,  action:action, module:module})
}

export const getAllAdminActions = async (req: Request, res: Response) => {
  const {
    adminId,
    module,
    action,
    sort = "createdAt",
    order = "desc",
    limit = "10",
    page = "1"
  } = req.query;

  const query: any = {};

  if (adminId) query.adminId = adminId;
  if (module) query.module = module;
  if (action) query.action = action;

  const limitNum = Math.max(1, parseInt(limit as string));
  const pageNum = Math.max(1, parseInt(page as string));
  const skip = (pageNum - 1) * limitNum;

  const sortOrder = order === "asc" ? sort : `-${sort}`;

  const actions = await AdminAction.find(query)
    .sort(sortOrder as string)
    .skip(skip)
    .limit(limitNum);

  const total = await AdminAction.countDocuments(query);

  res.status(StatusCodes.OK).json({
    count: actions.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    actions
  });
};

  