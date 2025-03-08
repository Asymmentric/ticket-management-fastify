import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import TicketController from "./controller";
import {
    createTicketValidation,
    deleteTicketValidation,
    fetchTicketByIdValidation,
    fetchTicketsValidation,
    updateTicketValidation,
} from "./validation";

const {
    createTicketController,
    fetchTicketByIdController,
    fetchAllTicketsController,
    updateTicketController,
    deleteTicketController,
} = new TicketController();
class TicketRouter {
    public ticketRoutes(fastify: FastifyInstance) {
        fastify.post(
            "/",
            { schema: createTicketValidation },
            createTicketController
        );

        fastify.get(
            "/",
            { schema: fetchTicketsValidation },
            fetchAllTicketsController
        );

        fastify.get(
            "/:id",
            { schema: fetchTicketByIdValidation },
            fetchTicketByIdController
        );

        fastify.patch(
            "/:id",
            { schema: updateTicketValidation },
            updateTicketController
        );

        fastify.delete(
            "/:id",
            { schema: deleteTicketValidation },
            deleteTicketController
        );
    }
}

export default TicketRouter;
