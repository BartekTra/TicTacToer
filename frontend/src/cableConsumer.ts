import { createConsumer } from "@rails/actioncable";

const cableUrl = import.meta.env.VITE_BACKEND_WEBSOCKET_URL as string;
export const consumer = createConsumer(cableUrl);
