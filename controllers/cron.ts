import Client from "../models/client";
import InvoiceDocument from "../models/invoiceDocument";
import { sendInvoice } from "./brevoEmails";

const cron = require('node-cron');

export const emailCron = () => cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      const invoiceToSend = await InvoiceDocument.findOne({
        year: currentYear,
        month: currentMonth,
        sent: false,
      });
      const clients = await Client.find({invoiceToEmail:true})
      if(!invoiceToSend) return
      clients.map(async (client)=>{
        await sendInvoice(client.email, `${client.firstName} ${client.lastName}`, invoiceToSend?.file)
      })
      invoiceToSend.sent = true
      await invoiceToSend.save()
    } catch (err) {
      console.error(" Error running invoice cron job:", err);
    }
  });

