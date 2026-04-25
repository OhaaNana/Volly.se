import express from "express";
import { register, login, refreshToken } from "../Controllers/authController";

const router = express.Router();

// Endpoints
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);

// Global error handler 
router.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Auth route error:", err.message);

    res.status(500).json({
      error: "Something went wrong",
      message: err.message,
    });
  }
);

export default router;