import { describe, it, expect } from "bun:test";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

describe("password hashing", () => {
  it("hashes a password and verifies the correct one", async () => {
    const password = "SuperSecret123";
    const hash = await bcrypt.hash(password, 10);

    expect(hash).not.toBe(password);
    expect(await bcrypt.compare(password, hash)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await bcrypt.hash("SuperSecret123", 10);

    expect(await bcrypt.compare("WrongPassword", hash)).toBe(false);
  });
});

describe("jwt access tokens", () => {
  const SECRET = "test_jwt_secret";

  it("signs a token that can be verified with the same secret", () => {
    const token = jwt.sign({ id: "user-1" }, SECRET, { expiresIn: "1h" });
    const decoded = jwt.verify(token, SECRET) as { id: string };

    expect(decoded.id).toBe("user-1");
  });

  it("fails verification when the secret is wrong", () => {
    const token = jwt.sign({ id: "user-1" }, SECRET);

    expect(() => jwt.verify(token, "another_secret")).toThrow();
  });
});
