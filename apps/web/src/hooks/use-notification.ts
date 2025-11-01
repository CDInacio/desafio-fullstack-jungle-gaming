//apps/web/src/hooks/use-notification.ts

import { createSocket, disconnectSocket } from "@/lib/socket";
import { useEffect } from "react";

type Handler = (payload: any) => void;

export function useNotifications(
  token: string | null,
  handlers?: {
    onTaskCreated?: Handler;
    onTaskUpdated?: Handler;
    onCommentNew?: Handler;
  }
) {
  useEffect(() => {
    if (!token) {
      disconnectSocket();
      return;
    }

    const socket = createSocket(token);

    const onTaskCreated = (payload: any) => {
      console.log("socket event task.created", payload);
      handlers?.onTaskCreated?.(payload);
    };
    const onTaskUpdated = (payload: any) => {
      console.log("socket event task.updated", payload);
      handlers?.onTaskUpdated?.(payload);
    };
    const onCommentNew = (payload: any) => {
      console.log("socket event comment.new", payload);
      handlers?.onCommentNew?.(payload);
    };

    socket.on("connect", () => {
      console.log("WS connected", socket.id);
    });

    socket.on("task.created", onTaskCreated);
    socket.on("task.updated", onTaskUpdated);
    socket.on("comment.new", onCommentNew);

    socket.on("disconnect", (reason) => {
      console.log("WS disconnected", reason);
    });

    return () => {
      socket.off("task.created", onTaskCreated);
      socket.off("task.updated", onTaskUpdated);
      socket.off("comment.new", onCommentNew);
      // we keep the connection alive across routes by not disconnecting
      // if you want to disconnect, call disconnectSocket() here.
    };
  }, [
    token,
    handlers?.onTaskCreated,
    handlers?.onTaskUpdated,
    handlers?.onCommentNew,
  ]);
}
