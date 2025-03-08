export interface IAgent {
    id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface IAgentCreate {
    name: string;
    email: string;
}
