import express from "express"
import { createTag, deleteTag, getAllTags, updateTag } from "../controllers/tags";

const router = express.Router();

router.route('/tag').post(createTag).patch(updateTag).delete(deleteTag).get(getAllTags)

export default router