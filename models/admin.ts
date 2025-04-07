import { Document, Schema, model } from "mongoose";
import { genSalt, hash, compare } from "bcryptjs";
const jwt = require('jsonwebtoken')
import type {BasicUser} from "../helpers/helperTypes"

export type PermissionAction = "view" | "add" | "update" | "delete";
export type PermissionModule = "news" | "documents" | "gallery" | "admins" | "clients";


export interface IAdmin extends Document {
  role: "super_admin" | "admin";
  permissions?: Map<PermissionModule, PermissionAction[]>;
  password: string;
}

interface IAdminUser extends BasicUser, IAdmin {
  createdAt: Date;
  updatedAt: Date;
  createJWT(): string;
  matchPassword(candidate: string): Promise<boolean>;
  matchTemporaryPassword(candidate: string): Promise<boolean>;
};

const AdminSchema = new Schema<IAdminUser>(
    {
      avatar: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true},
      phone: {
        type: String,
        required: true,
        validate: {
          validator: function (v: string) {
            return /^\+?[1-9]\d{1,14}$/.test(v);
          },
          message: (props: any) => `${props.value} is not a valid phone number!`,
        },
      },
      role: {
        type: String,
        enum: ["super_admin", "admin"],
        required: true,
      },
      password :{
          type : String,
          minlength: 8,
          required: true
      },
      permissions:{
      type: Map,
      of: [String],
      default: undefined,
      },
      tempPassword: {
        password: { type: String, default: null },
        validUntil: { type: Date, default: null },
        needsChange: { type: Boolean, default:false },
      },
    },
    { timestamps: true }
  );

  AdminSchema.methods.createJWT = function () {
    return jwt.sign(
      { userId: this._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
    );
  };

  AdminSchema.methods.matchPassword = async function (candidate : string) {
    const isMatch = await compare(candidate, this.password);
    return isMatch;
  };

  AdminSchema.methods.matchTemporaryPassword = async function (candidate : string) {
    const isMatch = await compare(candidate, this.tempPassword.password);
    return isMatch;
  };
  
  const Admin = model<IAdminUser>("Admin", AdminSchema);
  
  export default Admin;