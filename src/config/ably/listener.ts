import Ably from "ably";
import { AblyChannels } from "./enum";

// Initialize Ably client
const ably = new Ably.Realtime({ key: process.env.ABLY_API_KEY });

// Get the channel to listen on
const channel = ably.channels.get("tickets");

// Subscribe to ticket creation events
channel.subscribe(AblyChannels.TICKETS, (message) => {
    console.log("🎫 New Ticket Created:", message.data);
});

// Subscribe to ticket update events
channel.subscribe(AblyChannels.TICKETS, (message) => {
    console.log("🛠️ Ticket Updated:", message.data);
});

console.log("✅ Listening for ticket updates...");
