import { type FastifyRequest, type FastifyReply } from "fastify";
import { pool } from "../Config/db"; 


// Skapa en user
export const createUser = async (
  request: FastifyRequest<{ Body: { email: string; password: string } }>,
  reply: FastifyReply ) => {
  try {
    const { email, password } = request.body;

    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, password]
    );

    console.log("USER CREATED:", result.rows[0]);

    reply.send(result.rows[0]);
  } catch (error) {
    reply.code(500).send({ message: "Error creating user", error });
  }
};


// Hämta en user
export const getUser = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply ) => {
  try {
    const { id } = request.params;

    const result = await pool.query(
      "SELECT id, email FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({ message: "User not found" });
    }

    reply.send(result.rows[0]);
  } catch (error) {
    reply.code(500).send({ message: "Error fetching user", error });
  }
};


// Uppdatera user
export const updateUser = async (
  request: FastifyRequest<{ Params: { id: string }; Body: { email: string } }>,
  reply: FastifyReply ) => {
  try {
    const { id } = request.params;
    const { email } = request.body;

    const result = await pool.query(
      "UPDATE users SET email = $1 WHERE id = $2 RETURNING id, email",
      [email, id]
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({ message: "User not found" });
    }

    reply.send(result.rows[0]);
  } catch (error) {
    reply.code(500).send({ message: "Error updating user", error });
  }
};


// Ta bort user
export const deleteUser = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply ) => {
  try {
    const { id } = request.params;

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({ message: "User not found" });
    }

    reply.send({ message: "User deleted" });
  } catch (error) {
    reply.code(500).send({ message: "Error deleting user", error });
  }
};


// Hämta alla users
export const getUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  try { 
    const result = await pool.query(
      "SELECT id, email FROM users"
    );

    reply.send(result.rows);
  } catch (error) {
    reply.code(500).send({ message: "Error fetching users", error });
  }
};