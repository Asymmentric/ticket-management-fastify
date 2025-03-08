import { variables } from "../envLoader";
import Ably from "ably";
import { AblyChannels } from "./enum";

const { ABLY_API_KEY } = variables;

class AblyRT {
    private static instance: AblyRT;
    private realtime: Ably.Realtime;

    constructor() {
        this.realtime = new Ably.Realtime({
            key: ABLY_API_KEY,
            disconnectedRetryTimeout: 60000,
            suspendedRetryTimeout: 120000,
        });

        this.realtime.connection.on("disconnected", () => {
            console.log("⚠️ Ably disconnected. Attempting to reconnect...");
            this.realtime.connect();
        });

        this.startHeartbeat();
    }

    public static getInstance(): AblyRT {
        if (!AblyRT.instance) {
            AblyRT.instance = new AblyRT();
        }
        return AblyRT.instance;
    }

    public getChannelById(channelId: string) {
        return this.realtime.channels.get(channelId);
    }

    private startHeartbeat() {
        setInterval(() => {
            const ticketChannel = this.getChannelById(AblyChannels.TICKETS);
            ticketChannel.publish("ping", { timestamp: Date.now() });
        }, 25000);
    }
}

export default AblyRT;
