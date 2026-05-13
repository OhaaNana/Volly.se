export const registerSchema = {
  body: {
    type: "object",
    required: ["first_name", "last_name", "email", "password"],
    properties: {
      first_name: {
        type: "string",
        minLength: 3,
        maxLength: 30,
      },
      last_name: {
        type: "string",
        minLength: 3,
        maxLength: 30,
      },
      email: {
        type: "string",
        format: "email",
      },
      password: {
        type: "string",
        minLength: 8,
      },
    },
    additionalProperties: false,
  },
};

// for, efternamn, email, password
