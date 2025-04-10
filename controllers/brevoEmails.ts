import { Request, Response } from "express";
import BadRequest from "../errors/BadRequestError";
import { userExists, userType } from "../helpers/helperFunctions";
import Client from "../models/client";
import Admin from "../models/admin";
import { Model } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { passwordSchema } from "../validators/helperValidators";

const { v4: uuidv4 } = require("uuid");
const Brevo = require("@getbrevo/brevo");

export const sendPasswordEmail = async (req: Request, res: Response) => {
  const { userEmail } = req.body;
  if (!userEmail) {
    throw new BadRequest("Please provide user email");
  }

  const exists = await userExists(userEmail, true);
  if (!exists) {
    throw new BadRequest("User mail does not exist");
  }

  const role = await userType(userEmail, true);
  const userModel: Model<any> = role === "admin" ? Admin : Client;
  const tempPassword = uuidv4().slice(0, 8);
  const tempHashedPassword = await passwordSchema.safeParseAsync(tempPassword);
  const user = await userModel.findOneAndUpdate(
    { email: userEmail },
    {
      tempPassword: {
        password: tempHashedPassword.data,
        validUntil: new Date(Date.now() + 15 * 60 * 1000),
        needsChange: true,
      },
    },
    { new: true }
  );
  const apiInstance = new Brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    `${process.env.BREVO_KEY}`
  );
  const email = {
    to: [{ email: user.email, name: `${user.firstName} ${user.lastName}` }],
    sender: { email: "aceni3500@gmail.com", name: "Komunalne djelosti plav" },
    subject: "Reset your password",
    htmlContent: `<p>Your temporary password is ${tempPassword}</p>`,
  };
  await apiInstance.sendTransacEmail(email);
  res
    .status(StatusCodes.OK)
    .json({ msg: "Temporary password has been sent to user email" });
};

export const sendInvoice = async (userEmail: string, fullName:string, url:string) => {
  const apiInstance = new Brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    `${process.env.BREVO_KEY}`
  );
  const email = {
    to: [{ email: userEmail, name: fullName }],
    sender: { email: "aceni3500@gmail.com", name: "Komunalne djelosti plav" },
    subject: "Invoice file",
    htmlContent: `<p>invoice url ${url}</p>`,
  };
  await apiInstance.sendTransacEmail(email);
};
