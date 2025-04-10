import express from "express"
import { getNewsThisWeek, getTotalNewsCount, getTotalViews, getViewsThisWeek } from "../controllers/dashboard";

const router = express.Router();

router.route('/getTotalNewsCount').get(getTotalNewsCount)
router.route('/getNewsThisWeek').get(getNewsThisWeek)
router.route('/getTotalViews').get(getTotalViews)
router.route('/getViewsThisWeek').get(getViewsThisWeek)
router.route('/getAllClients').get(getViewsThisWeek)

export default router