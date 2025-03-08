import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import {
    createAgentValidation,
    fetchAgentsValidation,
    fetchAgentsByIdValidation,
    deleteAgentValidation,
} from "./validation";
import AgentController from "./controller";

const {
    createAgentController,
    fetchAgentByIdController,
    fetchAllAgentsController,
    deleteAgentController,
} = new AgentController();
class AgentRouter {
    public agentRoutes(fastify: FastifyInstance) {
        fastify.post(
            "/",
            { schema: createAgentValidation },
            createAgentController
        );

        fastify.get(
            "/",
            { schema: fetchAgentsValidation },
            fetchAllAgentsController
        );

        fastify.get(
            "/:id",
            { schema: fetchAgentsByIdValidation },
            fetchAgentByIdController
        );

        fastify.delete(
            "/:id",
            { schema: deleteAgentValidation },
            deleteAgentController
        );
    }
}

export default AgentRouter;
