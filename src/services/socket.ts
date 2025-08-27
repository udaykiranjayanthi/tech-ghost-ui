import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  auth: {
    token: `Bearer ${localStorage.getItem("auth_token")}`,
  },
  autoConnect: false,
});
