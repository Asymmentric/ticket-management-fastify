import { FastifySchema } from "fastify";
import { TicketPriorityList, TicketStatusList } from "./utils";

export const createTicketValidation: FastifySchema = {
    body: {
        type: "object",
        required: ["title", "description", "priority"],
        properties: {
            title: { type: "string", minLength: 3, maxLength: 100 },
            description: { type: "string", minLength: 3, maxLength: 100 },
            priority: { type: "number" },
        },
    },
};

export const fetchTicketsValidation: FastifySchema = {
    querystring: {
        type: "object",
        properties: {
            limit: { type: "number" },
            status: { type: "string" },
            priority: { type: "string" },
            agent: { type: "string" },
            cursor: { type: "string" },
            cursor_id: { type: "string" },
            sort_by: { type: "string" },
            sort_order: { type: "string" },
        },
    },
};

export const fetchTicketByIdValidation: FastifySchema = {
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "string" },
        },
    },
};

export const updateTicketValidation: FastifySchema = {
    body: {
        type: "object",
        properties: {
            id: { type: "string" },
            priority_id: { type: "number" },
            status_id: { type: "number" },
            assigned_to: { type: "string" },
        },
    },
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "string" },
        },
    },
};

export const deleteTicketValidation: FastifySchema = {
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "string" },
        },
    },
};
