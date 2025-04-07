import express from "express"
import { createAdmin, getAllAdminActions, getAllAdmins, getSingleAdmin, updateAdmin } from "../controllers/admin";

const router = express.Router();

router.route('/admin').post(createAdmin).patch(updateAdmin).get(getAllAdmins)
router.route('/admin/:id').get(getSingleAdmin)
router.route('/adminChanges').get(getAllAdminActions)

export default router