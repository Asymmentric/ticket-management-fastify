import { FastifyReply, FastifyRequest } from "fastify";
import TicketsService from "./service";
import CustomError from "../utils/errors/customError";
import AnotherError from "../utils/errors/anotherError";

class TicketController {
    private ticketService: TicketsService = new TicketsService();

    public createTicketController = async (
        req: FastifyRequest<{
            Body: { title: string; description: string; priority: number };
        }>,
        reply: FastifyReply
    ) => {
        try {
            const { title, description, priority } = req.body;

            const result = await this.ticketService.createTickets({
                title,
                description,
                priority_id: priority,
            });
            return reply.send({
                message: "Ticket created successfully",
                data: result,
            });
        } catch (error: any) {
            console.log(error);
            const statusCode = error.statusCode || 500;
            throw new AnotherError(
                error.codePhrase || "SOMETHING_WENT_WRONG",
                statusCode !== 500
                    ? error.message
                    : "Error Fetching Tickets. Please Try Again",

                error.statusCode || 500,
                error
            );
        }
    };

    public fetchAllTicketsController = async (
        req: FastifyRequest<{
            Querystring: {
                page: number;
                limit: number;
                status: string;
                priority: string;
                agent: string;
            };
        }>,
        reply: FastifyReply
    ) => {
        try {
            const { page, limit, status, priority, agent } = req.query;
            const result = await this.ticketService.fetchAllTicketsService(
                page,
                limit,
                status,
                agent,
                priority
            );
            return reply.send({
                message: "Tickets fetched successfully",
                data: result,
            });
        } catch (error: any) {
            console.log(error);
            const statusCode = error.statusCode || 500;
            throw new AnotherError(
                error.codePhrase || "SOMETHING_WENT_WRONG",
                statusCode !== 500
                    ? error.message
                    : "Error Fetching Tickets. Please Try Again",

                error.statusCode || 500,
                error
            );
        }
    };

    public fetchTicketByIdController = async (
        req: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const { id } = req.params;
            const result = await this.ticketService.fetchTicketByIdService(id);
            return reply.send({
                message: "Ticket fetched successfully",
                data: result,
            });
        } catch (error: any) {
            console.log(error);
            const statusCode = error.statusCode || 500;
            throw new AnotherError(
                error.codePhrase || "SOMETHING_WENT_WRONG",
                statusCode !== 500
                    ? error.message
                    : "Error Fetching Tickets. Please Try Again",

                error.statusCode || 500,
                error
            );
        }
    };

    public updateTicketController = async (
        req: FastifyRequest<{
            Params: { id: string };
            Body: { status: number; priority: number; agent: string };
        }>,
        reply: FastifyReply
    ) => {
        try {
            const { id } = req.params;
            const { status, priority, agent } = req.body;
            const result = await this.ticketService.updateTicketService({
                id,
                status_id: status,
                priority_id: priority,
                assigned_to: agent,
            });
            return reply.send({
                message: "Ticket updated successfully",
                data: result,
            });
        } catch (error: any) {
            console.log(error);
            const statusCode = error.statusCode || 500;
            throw new AnotherError(
                error.codePhrase || "SOMETHING_WENT_WRONG",
                statusCode !== 500
                    ? error.message
                    : "Error Fetching Tickets. Please Try Again",
                error.statusCode || 500,
                error
            );
        }
    };

    public deleteTicketController = async (
        req: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const { id } = req.params;
            const result = await this.ticketService.deleteTicketSerivce(id);
            return reply.send({
                message: "Ticket deleted successfully",
                data: result,
            });
        } catch (error: any) {
            console.log(error);
            const statusCode = error.statusCode || 500;
            throw new AnotherError(
                error.codePhrase || "SOMETHING_WENT_WRONG",
                statusCode !== 500
                    ? error.message
                    : "Error Fetching Tickets. Please Try Again",
                error.statusCode || 500,
                error
            );
        }
    };
}

export default TicketController;
