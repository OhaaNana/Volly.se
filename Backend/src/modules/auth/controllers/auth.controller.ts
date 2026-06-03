import type { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import dotenv from "dotenv";
import { isAdminEmail } from "../../../config/admin";

dotenv.config();
export const pool = new Pool({
  connectionString:
    process.env.POSTGRES_URI ??
    process.env.DATABASE_URL ??
    process.env.DATABASE_URI,
});

interface AuthRequestBody {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

interface RefreshTokenRequestBody {
  refreshToken: string;
}

// Access token
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_for_local";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "dev_jwt_refresh_secret_for_local";

const generateAccessToken = (id: string) => {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Refresh token
const generateRefreshToken = (id: string) => {
  if (!JWT_REFRESH_SECRET)
    throw new Error("JWT_REFRESH_SECRET is not configured");
  return jwt.sign({ id }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// Skapa konto
export const register = async (
  req: FastifyRequest<{ Body: AuthRequestBody }>,
  res: FastifyReply
) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).send({ message: "User exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password, onboarding_completed) VALUES ($1, $2, $3, $4, FALSE) RETURNING *",
      [first_name ?? null, last_name ?? null, email, hashedPassword]
    );

    const user = newUser.rows[0];

    res.status(201).send({
      message: "User created",
      id: user.id,
      token: generateAccessToken(user.id),
      refreshToken: generateRefreshToken(user.id),
      onboarding_completed: user.onboarding_completed,
      is_admin: isAdminEmail(user.email),
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).send({
      error: "Registration failed",
      details: error instanceof Error ? error.message : error,
    });
  }
};

// Logga in
export const login = async (
  req: FastifyRequest<{ Body: AuthRequestBody }>,
  res: FastifyReply
) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    const user = result.rows[0];

    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).send({ message: "Invalid password" });
    }

    res.send({
      id: user.id,
      token: generateAccessToken(user.id),
      refreshToken: generateRefreshToken(user.id),
      onboarding_completed: user.onboarding_completed,
      is_admin: isAdminEmail(user.email),
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).send({
      error: "Login failed",
      details: error instanceof Error ? error.message : error,
    });
  }
};

// Refresh token
export function refreshToken(
  req: FastifyRequest<{ Body: RefreshTokenRequestBody }>,
  res: FastifyReply
): any {
  const token = req.body.refreshToken;

  if (!token) {
    return res.status(401).send({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as any;

    const newAccessToken = generateAccessToken(decoded.id);

    res.send({ token: newAccessToken });
  } catch (error) {
    return res.status(403).send({ message: "Invalid refresh token" });
  }
}
