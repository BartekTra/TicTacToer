// src/cable.js
import { createConsumer } from "@rails/actioncable";

const cable = createConsumer(import.meta.env.VITE_BACKEND_WEBSOCKET_URL);

export default cable;
