export type ITicket = {
    id: string;
    title: string;
    status_id: number;
    priority_id: number;
    description: string;
    created_at: string;
    updated_at: string;
    assigned_to: string | null;
};

export type ICreateTicketReturnObj = Omit<
    ITicket,
    "assigned_to" | "status_id" | "priority_id"
>;

export type ICreateTicket = Pick<
    ITicket,
    "title" | "description" | "priority_id"
>;

export type ITypeReturnType = {
    id: string;
    name: string;
    slug: string;
};

export type ITicketDetails = Omit<
    ITicket,
    "assigned_to" | "status_id" | "priority_id"
> & {
    status: ITypeReturnType;
    priority: ITypeReturnType;
    assigned_to: { id: string; name: string; email: string } | null;
};

export type ITicketUpdate = {
    id: string;
    priority_id?: number;
    status_id?: number;
    assigned_to?: string | null;
};

export type ITicketUpdateDBQuery = {
    updateFieldsQuery: string;
    updateWhereQuery: string;
    params: any[];
};

export type IPublishMessage = {
    type: string;
    ticket: Array<{
        message: string;
        data?: Record<any, any>;
    }>;
};

export type IAllTicketServiceReqObj = {
    limit: string | number;
    pagination: {
        cursor: string | number;
        cursor_id: string;
        direction: string;
    };
    sort: {
        sort_by: string;
        sort_order: string;
    };
    filter: {
        filter_status?: string;
        filter_priority?: string;
        filter_agent?: string;
    };
};

export type IMetaResponse = {
    next: {
        cursor: string | number | null;
        cursor_id: string;
        sort_by: string;
        sort_order: "ASC" | "DESC";
    } | null;
    prev: {
        cursor: string | number | null;
        cursor_id: string;
        sort_by: string;
        sort_order: "ASC" | "DESC";
    } | null;
};

export interface IGeneratePaginationMetaParams {
    allItems: any[];
    limit: number;
    sortData: SortData;
    paginationData: PaginationData;
    sortMapper: Record<string, { field: string }>;
}
