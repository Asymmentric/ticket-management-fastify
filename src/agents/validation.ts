import { FastifySchema } from "fastify";

export const createAgentValidation: FastifySchema = {
    body: {
        type: "object",
        required: ["name", "email"],
        properties: {
            name: { type: "string", minLength: 3, maxLength: 255 },
            email: { type: "string", minLength: 3, maxLength: 255 },
        },
    },
};

export const fetchAgentsValidation: FastifySchema = {
    querystring: {
        type: "object",
        properties: {
            page: { type: "number" },
            limit: { type: "number" },
        },
    },
};

export const fetchAgentsByIdValidation: FastifySchema = {
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "string" },
        },
    },
};

export const deleteAgentValidation: FastifySchema = {
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "string" },
        },
    },
};
