import PostgresDB from "../config/database/postgres";
import {
    ICreateTicketReturnObj,
    ITicket,
    ITicketDetails,
    ITicketUpdate,
    ITicketUpdateDBQuery,
    ITypeReturnType,
} from "./types/interface";
class TicketsDB {
    public createTicketsQuery = async (data: ITicket[]) => {
        const { query, params } = PostgresDB.formatInsert(
            `INSERT INTO tickets ? RETURNING id, title, description, created_at, updated_at`,
            data
        );
        const { rows } = await PostgresDB.query(query, params);
        return rows[0] as unknown as ICreateTicketReturnObj;
    };

    public fetchStatusBySlug = async (slug: string) => {
        const { rows } = await PostgresDB.query(
            `SELECT * FROM status_types WHERE slug = $1`,
            [slug]
        );
        return rows[0] as unknown as ITypeReturnType;
    };

    public fetchPrioriyBySlug = async (slug: string) => {
        const { rows } = await PostgresDB.query(
            `SELECT id, name, slug FROM priority_types WHERE slug = $1 LIMIT 1`,
            [slug]
        );
        return rows[0] as unknown as ITypeReturnType;
    };

    public fetchPriorityById = async (id: string | number) => {
        const { rows } = await PostgresDB.query(
            `SELECT id, name, slug FROM priority_types WHERE id = $1 LIMIT 1`,
            [id]
        );
        return rows[0] as unknown as ITypeReturnType;
    };

    public fetchStausById = async (id: string | number) => {
        const { rows } = await PostgresDB.query(
            `SELECT id, name, slug FROM status_types WHERE id = $1 LIMIT 1`,
            [id]
        );
        return rows[0] as unknown as ITypeReturnType;
    };

    public fetchTicketsQuery = async (
        filterQuery: string,
        orderByQuery: string,
        limit: string | number
    ) => {
        const query = `
            SELECT
                t.id,
                t.title,
                t.description,
                ROW_TO_JSON(st.*) as status,
                ROW_TO_JSON(pt.*) as priority,
                t.created_at,
                t.updated_at,
                CASE 
                    WHEN t.assigned_to IS NULL
                    THEN NULL
                    ELSE JSON_BUILD_OBJECT(
                        'id',a.id,
                        'name',a.name,
                        'email',a.email
                    ) END
                AS agent
            FROM
                tickets t
            LEFT JOIN
                status_types st ON t.status_id = st.id
            LEFT JOIN
                priority_types pt ON t.priority_id = pt.id
            LEFT JOIN
                agents a ON t.assigned_to = a.id
            ${
                filterQuery.length
                    ? filterQuery
                    : " WHERE t.deleted_at IS NULL "
            } 
             
            ${orderByQuery}
            ${limit}
        `;

        const { rows } = await PostgresDB.query(query);
        return rows as unknown as ITicketDetails[];
    };

    public fetchTicketsByIdQuery = async (id: string) => {
        const query = `
            SELECT
                t.id,
                t.title,
                t.description,
                ROW_TO_JSON(st.*) as status,
                ROW_TO_JSON(pt.*) as priority,
                t.created_at,
                t.updated_at,
                CASE 
                    WHEN t.assigned_to IS NULL
                    THEN NULL
                    ELSE JSON_BUILD_OBJECT(
                        'id',a.id,
                        'name',a.name,
                        'email',a.email
                    ) END
                AS agent
            FROM
                tickets t
            LEFT JOIN
                status_types st ON t.status_id = st.id
            LEFT JOIN
                priority_types pt ON t.priority_id = pt.id
            LEFT JOIN
                agents a ON t.assigned_to = a.id
            WHERE t.id = $1 
                AND t.deleted_at IS NULL
        `;

        const { rows } = await PostgresDB.query(query, [id]);
        return rows as unknown as ITicketDetails[];
    };

    public updateTicketQuery = async (data: ITicketUpdateDBQuery) => {
        const query = `UPDATE tickets 
                        SET 
                            ${data.updateFieldsQuery}
                            ${data.updateWhereQuery}
                            AND deleted_at IS NULL
                        RETURNING 
                            id, title, description, created_at, updated_at;`;

        const { rows } = await PostgresDB.query(query, data.params);
        return rows[0] as unknown as ITicket;
    };

    public deleteTicketQuery = async (id: string) => {
        const { rows } = await PostgresDB.query(
            `UPDATE tickets SET deleted_at = NOW() WHERE id = $1 RETURNING id, title, description, created_at, updated_at`,
            [id]
        );
        return rows[0] as unknown as ITicket;
    };
}

export default TicketsDB;
