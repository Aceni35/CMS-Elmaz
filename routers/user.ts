import express from "express"
import { deleteUser, makeNewPassword, updatePassword } from "../controllers/user";

const router = express.Router();

router.route('/password').post(updatePassword)
router.route('/newPassword').post(makeNewPassword)
router.route('/deleteUser').delete(deleteUser)

export default router