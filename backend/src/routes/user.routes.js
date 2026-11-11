import { Router } from "express";
import {
  signup
} from "";

const router = Router();
router.route("/signup").post(signup);

export default router;