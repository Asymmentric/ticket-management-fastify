import PostgresDB from "../config/database/postgres";
import { IAgent } from "./types/interface";

export default class AgentsDB {
    public fetchAgentByIdQuery = async (id: string) => {
        const { rows } = await PostgresDB.query(
            `SELECT id, name, email FROM agents WHERE id = $1 AND deleted_at IS NULL`,
            [id]
        );
        return rows[0] as unknown as IAgent;
    };

    public createAgentQuery = async (data: IAgent[]) => {
        const { query, params } = PostgresDB.formatInsert(
            `INSERT INTO agents ? RETURNING id, name, email`,
            data
        );
        const { rows } = await PostgresDB.query(query, params);
        return rows[0] as unknown as IAgent;
    };

    public fetchAllAgentsQuery = async () => {
        const { rows } = await PostgresDB.query(
            `SELECT id, name, email FROM agents WHERE deleted_at IS NULL`
        );

        return rows as unknown as IAgent[];
    };

    public deleteAgentQuery = async (id: string) => {
        const { rows } = await PostgresDB.query(
            `UPDATE agents SET deleted_at = now() WHERE id = $1 RETURNING id, name, email`,
            [id]
        );
        return rows[0] as unknown as IAgent;
    };
}
