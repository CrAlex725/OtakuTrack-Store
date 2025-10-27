import express from "express";
import { 
  getUsers, 
  createUser, 
  getUserById, 
  updateUser, 
  deleteUser 
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
