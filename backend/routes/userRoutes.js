import express from "express";
import { body } from "express-validator";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post(
  "/create",
  [
    body("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 chars"),
    body("email").isEmail().withMessage("Invalid email format"),
  ],
  createUser
);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
