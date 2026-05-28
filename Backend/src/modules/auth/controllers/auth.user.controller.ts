import { type FastifyRequest, type FastifyReply } from "fastify";
import { pool } from "./auth.controller";

export const completeOnboarding = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = Number(request.user?.id);
    await pool.query(
      "UPDATE users SET onboarding_completed = TRUE WHERE id = $1",
      [userId]
    );
    reply.send({ success: true });
  } catch (error) {
    reply.code(500).send({ message: "Error completing onboarding", error });
  }
};

// Skapa en user
export const createUser = async (
  request: FastifyRequest<{ Body: { email: string; password: string } }>,
  reply: FastifyReply
) => {
  try {
    const { email, password } = request.body;

    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, first_name, last_name, bio",
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
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;

    const result = await pool.query(
      "SELECT id, email, first_name, last_name, bio FROM users WHERE id = $1",
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
  request: FastifyRequest<{
    Params: { id: string };
    Body: {
      email: string;
      first_name?: string;
      last_name?: string;
      bio?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const { email, first_name, last_name, bio } = request.body;

    const result = await pool.query(
      `UPDATE users
       SET email = COALESCE($1, email),
           first_name = COALESCE($2, first_name),
           last_name = COALESCE($3, last_name),
           bio = COALESCE($4, bio)
         WHERE id = $5
       RETURNING id, email, first_name, last_name, bio`,
      [email, first_name, last_name, bio, id]
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
  reply: FastifyReply
) => {
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
export const getUsers = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const result = await pool.query(
      "SELECT id, email, first_name, last_name, bio FROM users"
    );

    reply.send(result.rows);
  } catch (error) {
    reply.code(500).send({ message: "Error fetching users", error });
  }
};

export const getUserByEmail = async (
  request: FastifyRequest<{ Params: { email: string } }>,
  reply: FastifyReply
) => {
  try {
    const { email } = request.params;

    const result = await pool.query(
      "SELECT id, email, first_name, last_name, bio FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({ message: "User not found" });
    }

    reply.send(result.rows[0]);
  } catch (error) {
    reply.code(500).send({ message: "Error fetching user", error });
  }
};

export const updateUserByEmail = async (
  request: FastifyRequest<{
    Params: { email: string };
    Body: {
      email?: string;
      first_name?: string;
      last_name?: string;
      bio?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { email: currentEmail } = request.params;
    const { email, first_name, last_name, bio } = request.body;

    const result = await pool.query(
      `UPDATE users
       SET email = COALESCE($1, email),
           first_name = COALESCE($2, first_name),
           last_name = COALESCE($3, last_name),
           bio = COALESCE($4, bio)
       WHERE email = $5
       RETURNING id, email, first_name, last_name, bio`,
      [email, first_name, last_name, bio, currentEmail]
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({ message: "User not found" });
    }

    reply.send(result.rows[0]);
  } catch (error) {
    reply.code(500).send({ message: "Error updating user", error });
  }
};
