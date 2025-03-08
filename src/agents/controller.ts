import { FastifyReply, FastifyRequest } from "fastify";
import AnotherError from "../utils/errors/anotherError";
import AgentsService from "./service";

class AgentController {
    private agentService: AgentsService = new AgentsService();

    public createAgentController = async (
        req: FastifyRequest<{
            Body: { name: string; email: string };
        }>,
        reply: FastifyReply
    ) => {
        try {
            const { name, email } = req.body;

            const result = await this.agentService.createAgentService({
                name,
                email,
            });
            return reply.send({
                message: "Agent created successfully",
                data: result,
            });
        } catch (error: any) {
            console.log(error);
            const statusCode = error.statusCode || 500;
            throw new AnotherError(
                error.codePhrase || "SOMETHING_WENT_WRONG",
                statusCode !== 500
                    ? error.message
                    : "Error Creating Agent. Please Try Again",

                error.statusCode || 500,
                error
            );
        }
    };

    public fetchAllAgentsController = async (
        req: FastifyRequest<{
            Querystring: {
                page: number;
                limit: number;
            };
        }>,
        reply: FastifyReply
    ) => {
        try {
            const { page, limit } = req.query;
            const result = await this.agentService.fetchAllAgentsService();
            return reply.send({
                message: "Agents fetched successfully",
                data: result,
            });
        } catch (error: any) {
            console.log(error);
            const statusCode = error.statusCode || 500;
            throw new AnotherError(
                error.codePhrase || "SOMETHING_WENT_WRONG",
                statusCode !== 500
                    ? error.message
                    : "Error Fetching Agents. Please Try Again",

                error.statusCode || 500,
                error
            );
        }
    };

    public fetchAgentByIdController = async (
        req: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const { id } = req.params;
            const result = await this.agentService.fetchAgentByIdService(id);
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

    public deleteAgentController = async (
        req: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const { id } = req.params;
            const result = await this.agentService.deleteAgentService(id);
            return reply.send({
                message: "Agent deleted successfully",
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

export default AgentController;
