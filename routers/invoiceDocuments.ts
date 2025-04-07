import express from "express"
import { createInvoiceDocument, deleteInvoiceDocument, editInvoiceDocument } from "../controllers/invoiceDocument";

const router = express.Router();

router.route('/invoiceDocuments').post(createInvoiceDocument).patch(editInvoiceDocument).delete(deleteInvoiceDocument)

export default router