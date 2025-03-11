import { validate as UuidValidate } from "uuid";
import {
    IAllTicketServiceReqObj,
    IGeneratePaginationMetaParams,
    IMetaResponse,
    ITicketDetails,
    ITicketUpdate,
} from "./types/interface";
import { title } from "process";

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
    { key: string; type: string; operator: string; field: keyof ITicketDetails }
> = {
    created_at: {
        key: "t.created_at",
        type: "sort",
        operator: "ORDER BY t.created_at ?, t.id ?",
        field: "created_at",
    },
    status: {
        key: "t.status_id",
        type: "sort",
        operator: "ORDER BY t.status_id ?, t.id ?",
        field: "status",
    },
    priority: {
        key: "t.priority_id",
        type: "sort",
        operator: "ORDER BY t.priority_id ?, t.id ?",
        field: "priority",
    },
    title: {
        key: "t.title",
        type: "sort",
        operator: "ORDER BY t.title ?, t.id ?",
        field: "title",
    },
};

export const TicketStatusList = ["open", "in_progress", "resolved", "closed"];
export const TicketPriorityList = ["low", "medium", "high", "urgent"];

export const buildFilterQuery = (data: IAllTicketServiceReqObj) => {
    const limit =
        typeof data.limit === "string" ? parseInt(data.limit) : data.limit;

    const { filter_status, filter_priority, filter_agent } = data.filter;

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

    const sortData = buildSortQuery(data);

    if (sortData.query.length) {
        filterArray.push(sortData.query);
    }

    Object.entries(filterObj).forEach(([key, value]) => {
        if (value.length > 0) {
            filterArray.push(
                ` ${filterMapper[key].field} ${
                    filterMapper[key].operator
                } ( ${value.join(", ")} ) `
            );
        }
    });

    return {
        filterQuery: filterArray.length
            ? ` WHERE ${filterArray.join(" AND ")} `
            : "",
        order: sortData.order,
        pageLimit: data.limit ? ` LIMIT ${limit + 1} ` : "",
    };
};

export const buildSortQuery = (
    data: Omit<IAllTicketServiceReqObj, "limit" | "filter">
) => {
    const { sort_by = "created_at", sort_order = "ASC" } = data.sort;

    const { cursor, cursor_id } = data.pagination;

    const sortDetails = sortMapper[sort_by];

    const sortOrder = sort_order === "ASC" ? "ASC" : "DESC";

    const sortOrderByQuery = ` ${sortDetails.operator.replace(
        /\?/g,
        sortOrder
    )}`;

    const sortFilter = sort_order === "NEXT" ? ">" : "<";

    const sortFilterQuery = `(${sortDetails.key}, t.id) ${sortFilter} ('${cursor}', '${cursor_id}') `;

    return {
        query: cursor ? sortFilterQuery : "",
        order: sortOrderByQuery,
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

export function generatePaginationMeta({
    allItems,
    limit,
    sortData,
    paginationData,
    sortMapper,
}: IGeneratePaginationMetaParams): IMetaResponse {
    const meta: IMetaResponse = { next: null, prev: null };

    const isLastPage = allItems.length < limit;
    if (!isLastPage) {
        allItems.pop();
        const lastElement = allItems[limit - 1];
        const cursorField = sortMapper[sortData.sort_by].field;

        const generateCursor = (item: any) => {
            if (
                cursorField === "created_at" ||
                cursorField === "assigned_to" ||
                cursorField === "priority" ||
                cursorField === "status"
            ) {
                return (
                    item[cursorField]?.id ||
                    item[cursorField]?.name ||
                    item[cursorField] ||
                    null
                );
            }
            return null;
        };

        meta.next = {
            cursor: generateCursor(lastElement),
            cursor_id: lastElement.id,
            sort_by: sortData.sort_by,
            sort_order: sortData.sort_order === "ASC" ? "DESC" : "ASC",
        };

        meta.prev = {
            cursor: generateCursor(allItems[0]),
            cursor_id: allItems[0].id,
            sort_by: sortData.sort_by,
            sort_order: sortData.sort_order === "ASC" ? "DESC" : "ASC",
        };
    }

    if (!paginationData.cursor) {
        meta.prev = null;
    }

    return meta;
}
