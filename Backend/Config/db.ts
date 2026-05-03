import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// PostgreSQL connection pool
export const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  max: 10, 
  idleTimeoutMillis: 30000, // stänger inaktiva connections
  connectionTimeoutMillis: 2000,
});

// Testa connection direkt när servern startar
pool.on("connect", () => {
  console.log("PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error", err);
  process.exit(-1);
});