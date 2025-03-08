import { validate as UuidValidate } from "uuid";
import { ITicketUpdate } from "./types/interface";

const filterMapper: Record<
    string,
    { field: string; type: string; operator: string }
> = {
    status: {
        field: "t.status_id",
        type: "filter",
        operator: "IN",
    },
    priority: {
        field: "t.priority_id",
        type: "filter",
        operator: "IN",
    },
    agent: {
        field: "t.assigned_to",
        type: "filter",
        operator: "IN",
    },
};

export const sortMapper: Record<
    string,
    { key: string; type: string; operator: string }
> = {
    created_at: {
        key: "u.created_at",
        type: "sort",
        operator: "ORDER BY t.created_at ?, t.id ?",
    },
    status: {
        key: "t.status_id",
        type: "sort",
        operator: "ORDER BY t.status_id ?, t.id ?",
    },
    priority: {
        key: "t.priority_id",
        type: "sort",
        operator: "ORDER BY t.priority_id ?, t.id ?",
    },
};

export const TicketStatusList = ["open", "in_progress", "resolved", "closed"];
export const TicketPriorityList = ["low", "medium", "high", "urgent"];

export const buildFilterQuery = (
    filter_status?: string,
    filter_priority?: string,
    filter_agent?: string
) => {
    const filterObj: Record<string, any[]> = {
        status: [],
        priority: [],
        agent: [],
    };
    if (filter_status) {
        const statusArray = filter_status.split(",").map((i) => parseInt(i));
        filterObj.status = statusArray;
    }

    if (filter_priority) {
        const priorityArray = filter_priority
            .split(",")
            .map((i) => parseInt(i));
        filterObj.priority = priorityArray;
    }

    if (filter_agent) {
        filterObj.agent = filter_agent
            .split(",")
            .filter((a) => {
                const b = UuidValidate(a);
                if (b) {
                    return a;
                }
            })
            .map((i) => `'${i}'`);
    }

    const filterArray: string[] = [];

    Object.entries(filterObj).forEach(([key, value]) => {
        if (value.length > 0) {
            filterArray.push(
                ` ${filterMapper[key].field} ${
                    filterMapper[key].operator
                } ( ${value.join(", ")} ) `
            );
        }
    });

    return filterArray.length ? ` WHERE ${filterArray.join(" AND ")} ` : "";
};

export const buildSortQuery = (
    cursor_id: string,
    cursor: string | number,
    sort_order: string,
    sort_by: string
) => {
    const sortOrder = sort_order === "ASC" ? "ASC" : "DESC";
    const sortFilter = sort_order === "ASC" ? "<" : ">";
    const sortDetails = sortMapper[sort_by];
    const sortFilterQuery = `(${sortDetails.key}, t.id) ${sortFilter} ($?, $?)`;
    const sortOrderByQuery = ` ${sortDetails.operator.replace("?", sortOrder)}`;

    return {
        sortFilterQuery: cursor ? sortFilterQuery : "",
        sortFilterParams: [cursor, cursor_id],
        sortOrderByQuery,
    };
};

/**
 * Build an UPDATE query for updating a ticket.
 *
 * @param {ITicketUpdate} data - The ticket data to update.
 * @returns {string} The UPDATE query.
 */
export const buildUpdateQuery = (data: ITicketUpdate) => {
    let updateFieldsArray: string[] = [];
    const params: any[] = [];
    let counter = 1;

    const { id, priority_id, status_id, assigned_to } = data;

    if (priority_id) {
        updateFieldsArray.push(` priority_id = $${counter} `);
        params.push(priority_id);
        counter++;
    }

    if (status_id) {
        updateFieldsArray.push(`status_id= $${counter}`);

        params.push(status_id);
        counter++;
    }

    if (assigned_to) {
        updateFieldsArray.push(`assigned_to=$${counter}`);
        params.push(assigned_to);
        counter++;
    }

    params.push(id);
    const updateFieldsQuery = updateFieldsArray.length
        ? updateFieldsArray.join(",")
        : "";
    const updateWhereQuery = ` WHERE id = $${counter}`;

    return {
        updateFieldsQuery,
        updateWhereQuery,
        params,
    };
};
