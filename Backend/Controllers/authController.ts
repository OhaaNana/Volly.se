import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import dotenv from "dotenv";


dotenv.config();
const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

// Access token
const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};


// Referesh token
const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};


// Skapa konto
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    );

    const user = newUser.rows[0];

    res.status(201).json({
      message: "User created",
      token: generateAccessToken(user.id),
      refreshToken: generateRefreshToken(user.id),
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      error: "Registration failed",
      details: error instanceof Error ? error.message : error,
    });
  }
};

// Logga in
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      token: generateAccessToken(user.id),
      refreshToken: generateRefreshToken(user.id),
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      error: "Login failed",
      details: error instanceof Error ? error.message : error,
    });
  }
};

// Refresh token
export const refreshToken = (req: Request, res: Response) => {
  const token = req.body.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as any;

    const newAccessToken = generateAccessToken(decoded.id);

    res.json({ token: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};