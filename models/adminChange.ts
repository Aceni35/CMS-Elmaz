import { Document, Schema, model } from "mongoose";
import { PermissionAction, PermissionModule } from "../helpers/helperTypes";

export interface AdminAction extends Document {
    adminId: string,
    module: PermissionModule,
    action:PermissionAction,
    createdAt: Date;
    updatedAt: Date;
}

const AdminActionSchema = new Schema<AdminAction>(
    {
    adminId:{
        type:String,
        required:true
    },
    action:{
        enum: ['add',"delete","update","view"],
        required:true,
        type:String
    },
    module:{
        enum :["news" , "documents" , "gallery" , "admins" , "clients"],
        required:true,
        type:String
    }
    },
    { timestamps: true }
  );

  
  const AdminAction = model<AdminAction>("AdminAction", AdminActionSchema);
  
  export default AdminAction;