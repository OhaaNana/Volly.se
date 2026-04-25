import { type FastifyRequest, type FastifyReply } from "fastify";

// Hämta alla users / användare
export const getUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await request.server.pg.query(
      "SELECT id, email FROM users"
    );

    reply.send(result.rows);
  } catch (error) {
    reply.code(500).send({ message: "Error fetching users", error });
  }
};

// Hämta en user / användare
export const getUser = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;

    const result = await request.server.pg.query(
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

// Updatera user / användare
export const updateUser = async (
  request: FastifyRequest<{ Params: { id: string }; Body: { email: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const { email } = request.body;

    const result = await request.server.pg.query(
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


// Ta bort user / användare
export const deleteUser = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;

    const result = await request.server.pg.query(
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