import express from "express"
import { createCategory, deleteCategory, updateCategory } from "../controllers/category";

const router = express.Router();

router.route('/category').post(createCategory).patch(updateCategory).delete(deleteCategory)

export default router