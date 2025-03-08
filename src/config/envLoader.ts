import dotenv from "dotenv";

dotenv.config();

const ENV = [
    "BASE_URL",
    /**
     * DB variables
     */

    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",

    "PORT",

    /**
     * ABLY
     */

    "ABLY_API_KEY",
] as const;

const loadVars = (env: readonly String[]): Record<string, string> => {
    const variables: Record<string, string> = {};

    env.forEach((name) => {
        const value = process.env[`${name}`];

        if (value) {
            variables[`${name}`] = value;
        } else {
            console.error(`Env ${name} not found`);
        }
    });

    return variables;
};

export const variables: Record<(typeof ENV)[number], string> = loadVars(ENV);
