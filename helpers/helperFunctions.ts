import Admin from "../models/admin";
import Client from "../models/client";
import bcrypt from "bcryptjs"
import {PermissionAction} from "./helperTypes"
import {PermissionModule} from "./helperTypes"
import News from "../models/news";
import Tag from "../models/tags";
import Category from "../models/category";
import DocumentModel from "../models/documents";
import InvoiceDocument from "../models/invoiceDocument";


type UserPermissions = {
  [key in PermissionModule]?: PermissionAction[];
};

export function hasPermission(
    sector: PermissionModule,
    action: PermissionAction,
    role : "super_admin" | "admin",
    permissions: UserPermissions | undefined
  ): boolean {
    if(role === "super_admin"){
        return true
    }
    const allowedActions = permissions![sector] || [];
    return allowedActions.includes(action);
  }

export const emailInUse = async (email:string) : Promise<boolean> => {
  const adminUser = await Admin.findOne({email})
  const clientUser =await Client.findOne({email})
  if(!adminUser && !clientUser){
    return false
  }else{
    return true
  }
}

export const userType = async (id: string, email=false) =>{
  let admin;
  if(email){
    admin = await Admin.findOne({email:id})
  }else{
    admin = await Admin.findById({_id:id})
  }
  if(!admin){
    return "client"
  }else{
    return "admin"
  }
}

export const userExists = async (id:string, email=false)=>{
  let client;
  let admin;
  if(email){
    admin = await Admin.findOne({email:id})
    client = await Client.findOne({email:id})
  }else{
    client = await Client.findById({_id:id})
    admin = await Admin.findById({_id:id})
  }
  if(!client && !admin){
    return false
  }else{
    return true
  }
}

export const newsExists = async (id: string)=>{
  const exists = await News.findById({_id: id})
  return exists ? true : false
}

export const tagExists = async(id:string)=>{
  const exists = await Tag.findById({_id:id})
  return exists ? true : false
}

export const categoryExists = async (id:string)=>{
  const exists = await Category.findById({_id:id})
  return exists ? true : false
}

export const documentExists = async (id:string)=>{
  const exists = await DocumentModel.findById({_id:id})
  return exists ? true : false
}

export const invoiceDocumentExists = async (id:string)=>{
  const exists = await InvoiceDocument.findById({_id:id})
  return exists ? true : false
}

export const hashPassword = async (password: string)=>{
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);
  return hashedPass
}