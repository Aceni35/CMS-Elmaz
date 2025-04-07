import { Schema, Document, model } from "mongoose";
import { BasicUser } from "../helpers/helperTypes";
import { genSalt, hash, compare } from "bcryptjs";
const jwt = require('jsonwebtoken')

interface Client extends Document {
    invoiceToEmail : boolean;
    company : string;
    code:string;
    type : "company" | "personal";
    area : "Plav" | "Murino" | "Ruralne oblasti";
}

interface ClientUser extends Client, BasicUser {
    createdAt: Date;
    updatedAt: Date;
    createJWT(): string;
  matchPassword(candidate: string): Promise<boolean>;
  matchTemporaryPassword(candidate: string): Promise<boolean>;
};

const ClientSchema = new Schema<ClientUser>({
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
    password: {
        type: String,
        required: true,
        minlength:8
    },
    invoiceToEmail:{
        type: Boolean,
        default: false
    },
    company : {
        type : String,
        require: true
    },
    type:{
        type: String,
        enum : ['company', 'personal'],
    },
    area:{
        type :String,
        enum : ['Plav', "Murino", "Ruralne Oblasti"]
    },
    code:{
      type:String,
      required:true
    },
    tempPassword: {
      password: { type: String, default: null },
      validUntil: { type: Date, default: null },
      needsChange: { type: Boolean, default:false },
    },
},{
    timestamps: true
})


ClientSchema.methods.createJWT = function () {
    return jwt.sign(
      { userId: this._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
    );
  };
  ClientSchema.methods.matchTemporaryPassword = async function (candidate : string) {
      const isMatch = await compare(candidate, this.tempPassword.password);
      return isMatch;
    };

  ClientSchema.methods.matchPassword = async function (candidate : string) {
    const isMatch = await compare(candidate, this.password);
    return isMatch;
  };


const Client = model<ClientUser>('Client', ClientSchema)

export default Client