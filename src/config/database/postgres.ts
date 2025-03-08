import pg, { Pool } from "pg";
import { variables } from "../envLoader";

export default class PostgresDB {
    private static pool: Pool;

    constructor() {
        const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } = variables;

        PostgresDB.pool = new pg.Pool({
            user: DB_USER,
            host: DB_HOST,
            database: DB_NAME,
            password: DB_PASSWORD,
            port: parseInt(String(DB_PORT)),
            ssl: {
                rejectUnauthorized: false,
            },
        });
    }

    static query = async (query: string, params?: any) => {
        if (process.env.NODE_ENV !== "production") {
            console.log(`- - -\n Query:\t\x1b[32m ${query}\n\x1b[39m- - - `);
            console.log(`- - -\n Params:\t\x1b[34m ${params}\n\x1b[39m- - - `);
        }
        const result = await PostgresDB.pool.query(query, params);
        return result;
    };

    static formatInsert = (query: string, data: Array<object>) => {
        const keys = Object.keys(data[0]);

        const placeholders = data
            .map((i, index) => {
                return `(${Object.values(i).map(
                    (item, count) => `$${data.length * (index + 1) + count}`
                )})`;
            })
            .join(",");

        const values = `(${keys}) VALUES ${placeholders}`;

        const params: Array<string> = [];
        data.map((item) =>
            Object.values(item).map((i) => {
                params.push(i);
            })
        );

        const result = query.replace("?", values);
        console.log("\n", result);
        return { query: result, params };
    };

    static toDoQueryIndex = `
    CREATE INDEX idx_tickets_status ON tickets (status_id);
    CREATE INDEX idx_tickets_priority ON tickets (priority_id);
    CREATE INDEX idx_tickets_assigned_to ON tickets (assigned_to);
    `;
}
