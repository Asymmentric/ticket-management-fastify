import { v4, validate as UuidValidate } from "uuid";
import TicketsDB from "./db";
import { IAgent, IAgentCreate } from "./types/interface";
import moment from "moment";
import AnotherError from "../utils/errors/anotherError";
import AgentsDB from "../agents/db";

class AgentsService {
    private ticketsDB = new TicketsDB();

    private agentsDB = new AgentsDB();

    public createAgentService = async (data: IAgentCreate) => {
        const agentObj = {
            id: v4(),
            name: data.name,
            email: data.email,
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
        };
        const result = await this.agentsDB.createAgentQuery([agentObj]);
        return result;
    };

    public fetchAllAgentsService = async () => {
        const result = await this.agentsDB.fetchAllAgentsQuery();
        return result;
    };

    public fetchAgentByIdService = async (id: string) => {
        if (!UuidValidate(id)) {
            throw new AnotherError(
                "RESOURCE_NOT_FOUND",
                "Agent not found",
                400,
                null
            );
        }
        const result = await this.agentsDB.fetchAgentByIdQuery(id);
        return result;
    };

    public deleteAgentService = async (id: string) => {
        if (!UuidValidate(id)) {
            throw new AnotherError(
                "RESOURCE_NOT_FOUND",
                "Agent not found",
                400,
                null
            );
        }
        const result = await this.agentsDB.deleteAgentQuery(id);
        return result;
    };
}

export default AgentsService;
