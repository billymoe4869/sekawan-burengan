import { Router } from "express";
import { register, loginUser } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middelware.js";
import { registerUserSchema, loginUserSchema } from "../schema/user.schema.js";

const router = Router();

// endpoint untuk register / pendaftaran user
router.post("/register", validate(registerUserSchema), register);

// endpoint untuk login
router.post(
  "/login",
  validate(loginUserSchema),
  loginUser,
);

export default router;
