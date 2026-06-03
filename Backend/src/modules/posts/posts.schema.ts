export const postSchema = {
  body: {
    type: "object",
    required: ["title", "description", "help_type", "category"],
    properties: {
      title: {
        type: "string",
        minLength: 3,
        maxLength: 80,
      },
      description: {
        type: "string",
        minLength: 3,
        maxLength: 500,
      },
      category: {
        type: "string",
        enum: [
          "Hälsa",
          "Teknik",
          "Vardag",
          "Studier",
          "Språk",
          "Karriär",
          "Administration",
          "Socialt",
          "Funktionsvariation",
          "Övrigt",
        ],
      },
      help_type: {
        type: "string",
        enum: ["getHelp", "giveHelp"],
      },
      tagg: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
};
