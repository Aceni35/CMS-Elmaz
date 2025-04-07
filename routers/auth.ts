import express from "express"
import { LogIn } from "../controllers/authenticate";
import { sendPasswordEmail } from "../controllers/brevoEmails";

const router = express.Router();

router.route('/login').post(LogIn)
router.route('/forgotPassword').post(sendPasswordEmail)

export default router