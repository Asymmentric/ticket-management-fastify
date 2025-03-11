// Import the framework and instantiate it
import Fastify from "fastify";
import TicketRouter from "./tickets/route";
import { ErrorHandler } from "./utils/errors/errorHandler";
import PostgresDB from "./config/database/postgres";
import AblyRT from "./config/ably";
import { variables } from "./config/envLoader";
import AgentRouter from "./agents/route";
const fastify = Fastify({
    logger: true,
});

class Server {
    private app = Fastify({
        logger: true,
    });
    private port: number;

    constructor(port: number) {
        this.port = port;
    }

    private router() {
        this.app.get("/ping", async function handler(request, reply) {
            return "pong";
        });
        this.app.register(new TicketRouter().ticketRoutes, {
            prefix: "/api/v1/tickets",
        });

        this.app.register(new AgentRouter().agentRoutes, {
            prefix: "/api/v1/agents",
        });
    }

    public async start() {
        try {
            await new PostgresDB();
            ErrorHandler(this.app);
            this.router();
            await this.app.listen({ host: "0.0.0.0", port: this.port });
        } catch (err) {
            this.app.log.error(err);
            process.exit(1);
        }
    }
}

const server = new Server(parseInt(variables.PORT));
server.start();

process.on("SIGTERM", (signal) => {
    console.debug(signal);
    console.debug(`Process ${process.pid} received a SIGTERM signal`);
    process.exit(0);
});

process.on("SIGINT", (signal) => {
    console.debug(signal);
    console.debug(`Process ${process.pid} has been interrupted`);
    process.exit(0);
});

process.on("uncaughtException", (err) => {
    console.error(err);
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});
