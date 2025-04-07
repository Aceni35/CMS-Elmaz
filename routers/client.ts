import express from "express"
import { createClient, updateClient } from "../controllers/client";

const router = express.Router();

router.route('/client').post(createClient).patch(updateClient)

export default router