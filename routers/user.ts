import express from "express"
import { deleteUser, updatePassword } from "../controllers/user";

const router = express.Router();

router.route('/password').post(updatePassword)
router.route('/deleteUser').delete(deleteUser)

export default router