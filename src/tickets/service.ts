import { v4, validate as UuidValidate } from "uuid";
import TicketsDB from "./db";
import {
    ICreateTicket,
    IPublishMessage,
    ITicket,
    ITicketUpdate,
} from "./types/interface";
import moment from "moment";
import AnotherError from "../utils/errors/anotherError";
import {
    buildFilterQuery,
    buildUpdateQuery,
    TicketPriorityList,
    TicketStatusList,
} from "./utils";
import AgentsDB from "../agents/db";
import AblyRT from "../config/ably";
import { AblyChannels } from "../config/ably/enum";

class TicketsService {
    private ticketsDB = new TicketsDB();

    private agentsDB = new AgentsDB();

    public createTickets = async (data: ICreateTicket) => {
        const openStatusType = await this.ticketsDB.fetchStatusBySlug("open");

        const priorityType = await this.ticketsDB.fetchPriorityById(
            data.priority_id.toString()
        );

        if (!priorityType) {
            throw new AnotherError(
                "RESOURCE_NOT_FOUND",
                "Priority not found",
                400,
                null
            );
        }

        const createTicketObj: ITicket = {
            id: v4(),
            title: data.title,
            description: data.description,
            status_id: parseInt(openStatusType.id),
            priority_id:
                typeof data.priority_id === "string"
                    ? parseInt(data.priority_id)
                    : data.priority_id,
            assigned_to: null,
            created_at: moment().format(),
            updated_at: moment().format(),
        };

        const result = await this.ticketsDB.createTicketsQuery([
            createTicketObj,
        ]);

        const ably = AblyRT.getInstance();
        const ticketChannel = ably.getChannelById(AblyChannels.TICKETS);
        const publishMessageObj: IPublishMessage = {
            type: "ticket_created",
            ticket: [{ message: "Ticket created successfully", data: result }],
        };

        ticketChannel.publish(AblyChannels.TICKETS, publishMessageObj);

        return result;
    };

    public fetchAllTicketsService = async (
        page: number,
        limit: number,
        filter_status: string,
        filter_agent: string,
        filter_priority: string
    ) => {
        const filterQuery = buildFilterQuery(
            filter_status,
            filter_priority,
            filter_agent
        );

        const allTickets = await this.ticketsDB.fetchTicketsQuery(filterQuery);

        return allTickets;
    };

    public fetchTicketByIdService = async (id: string) => {
        const validUUID = UuidValidate(id);

        if (!validUUID) {
            throw new AnotherError(
                "RESOURCE_NOT_FOUND",
                "Ticket not found",
                400,
                null
            );
        }

        const ticket = await this.ticketsDB.fetchTicketsByIdQuery(id);
        return ticket;
    };

    public updateTicketService = async (data: ITicketUpdate) => {
        if (!UuidValidate(data.id)) {
            throw new AnotherError(
                "INVALID_INPUT",
                "Ticket not found",
                400,
                null
            );
        }

        const publishMessageObj: IPublishMessage = {
            type: "ticket_updated",
            ticket: [],
        };

        if (data.assigned_to) {
            if (!UuidValidate(data.assigned_to)) {
                throw new AnotherError(
                    "INVALID_INPUT",
                    "Agent not found",
                    400,
                    null
                );
            }

            const agent = await this.agentsDB.fetchAgentByIdQuery(
                data.assigned_to
            );

            if (!agent) {
                throw new AnotherError(
                    "RESOURCE_NOT_FOUND",
                    "Agent not found",
                    400,
                    null
                );
            }

            publishMessageObj.ticket.push({
                message: "Agent assigned successfully",
            });
        }

        if (data.status_id) {
            const statusType = await this.ticketsDB.fetchStausById(
                data.status_id
            );

            if (!statusType) {
                throw new AnotherError(
                    "RESOURCE_NOT_FOUND",
                    "Status not found",
                    400,
                    null
                );
            }

            publishMessageObj.ticket.push({
                message: "Ticket status updated",
            });
        }

        if (data.priority_id) {
            const priorityType = await this.ticketsDB.fetchPriorityById(
                data.priority_id
            );

            if (!priorityType) {
                throw new AnotherError(
                    "RESOURCE_NOT_FOUND",
                    "Priority not found",
                    400,
                    null
                );
            }

            publishMessageObj.ticket.push({
                message: "Ticket priority updated",
            });
        }

        const { params, updateFieldsQuery, updateWhereQuery } =
            buildUpdateQuery(data);

        if (!updateFieldsQuery.length) {
            throw new AnotherError(
                "INVALID_INPUT",
                "No fields to update",
                400,
                null
            );
        }

        const result = await this.ticketsDB.updateTicketQuery({
            updateFieldsQuery,
            updateWhereQuery,
            params,
        });
        const lastIndexOfPublishMessage = publishMessageObj.ticket.length - 1;

        Object.assign(publishMessageObj.ticket[lastIndexOfPublishMessage], {
            data: result,
        });

        const ably = AblyRT.getInstance();

        const ticketChannel = ably.getChannelById(AblyChannels.TICKETS);

        ticketChannel.publish(AblyChannels.TICKETS, publishMessageObj);

        return result;
    };

    public deleteTicketSerivce = async (id: string) => {
        if (!UuidValidate(id)) {
            throw new AnotherError(
                "RESOURCE_NOT_FOUND",
                "Ticket not found",
                400,
                null
            );
        }
        const result = await this.ticketsDB.deleteTicketQuery(id);
        if (!result) {
            throw new AnotherError(
                "RESOURCE_NOT_FOUND",
                "Ticket not found",
                400,
                null
            );
        }

        return result;
    };
}

export default TicketsService;
