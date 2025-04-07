import express from "express"
import { createDocument, deleteDocument, editDocument } from "../controllers/documents";

const router = express.Router();

router.route('/documents').post(createDocument).patch(editDocument).delete(deleteDocument)

export default router