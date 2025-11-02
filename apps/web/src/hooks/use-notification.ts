import { createSocket, disconnectSocket } from "@/lib/socket";
import { useEffect } from "react";

type Handler = (payload: any) => void;

export function useNotifications(
  userId: string | null, // ✅ Receber userId ao invés de token
  handlers?: {
    onTaskCreated?: Handler;
    onTaskUpdated?: Handler;
    onCommentNew?: Handler;
  }
) {
  useEffect(() => {
    if (!userId) {
      disconnectSocket();
      return;
    }

    const socket = createSocket(userId); // ✅ Passar userId

    const onTaskCreated = (payload: any) => handlers?.onTaskCreated?.(payload);
    const onTaskUpdated = (payload: any) => handlers?.onTaskUpdated?.(payload);
    const onCommentNew = (payload: any) => handlers?.onCommentNew?.(payload);

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
    };
  }, [
    userId,
    handlers?.onTaskCreated,
    handlers?.onTaskUpdated,
    handlers?.onCommentNew,
  ]);
}
