import express from "express"
import { createNews, deleteNews, editNews, getAllNews, getPopularNewsThisMonth, getSingleNews } from "../controllers/news";

const router = express.Router();

router.route('/news').post(createNews).patch(editNews).delete(deleteNews).get(getAllNews)
router.route('/newsThisMonth').get(getPopularNewsThisMonth)
router.route('/singleNews/:id').get(getSingleNews)

export default router