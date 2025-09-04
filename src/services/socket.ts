import ENDPOINTS from "@/common/endpoints";
import { io } from "socket.io-client";

export const socket = io(ENDPOINTS.MESSAGING_WS, {
  auth: {
    token: `Bearer ${localStorage.getItem("auth_token")}`,
  },
  autoConnect: false,
});
