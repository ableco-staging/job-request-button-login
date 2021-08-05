import { getSession } from "blitz";
import db from "db";
import { Server, Socket } from "socket.io";

// Using a global object because when I used a module variable, it
// was overriden by the initialize value null and somehow the value
// was both null and the server intermitently.
global.io = global.io ?? null;

const io: Server | null = global.io;

function initIO(): Server {
  global.io = new Server();
  return global.io;
}

export const MESSAGE_TYPES = {
  updatedTasks: "updatedTasks",
  sampleEvent: "sampleEvent",
} as const;

type MessageType = keyof typeof MESSAGE_TYPES;

function setupRoomsOnConnection(io: Server) {
  io.on("connection", async (socket: Socket) => {
    const session = await getSession(socket.request, {} as any);
    if (session.userId) {
      const user = await db.user.findUnique({
        where: { id: session.userId },
        include: { organization: true },
      });

      if (user) {
        socket.join(`organizations/${user.organization.domain}`);
      }
    }
  });
}

async function emitWithUserId(
  userId: number,
  eventName: MessageType,
  ...args: Array<unknown>
) {
  if (!io) {
    return;
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { organization: true },
  });

  if (user) {
    io.to(`organizations/${user.organization.domain}`).emit(eventName, args);
  }
}

export { initIO, setupRoomsOnConnection, emitWithUserId };
