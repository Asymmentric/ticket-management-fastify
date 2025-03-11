import Ably from "ably";
import { AblyChannels, AblyEvents } from "./enum";

// Initialize Ably client
const ably = new Ably.Realtime({ key: process.env.ABLY_API_KEY });

// Get the channel to listen on
const channel = ably.channels.get(AblyChannels.TICKETS);

// Subscribe to ticket creation events
channel.subscribe(AblyEvents.TICKET_CREATED, (message) => {
    console.log("🎫 New Ticket Created:", message.data);
});

// Subscribe to ticket update events
channel.subscribe(AblyEvents.TICKET_UPDATED, (message) => {
    console.log("🛠️ Ticket Updated:", message.data);
});

console.log("✅ Listening for ticket updates...");
