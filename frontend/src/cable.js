// src/cable.js
import { createConsumer } from "@rails/actioncable";

const cable = createConsumer("ws://localhost:3000/cable"); // zmień jeśli masz inne host/port

export default cable;
