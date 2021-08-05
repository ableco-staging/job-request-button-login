import { resolver } from "blitz";
import db from "db";
import { emitWithUserId } from "io";
import { z } from "zod";

const CreateTaskParams = z.object({
  description: z.string(),
});

export default resolver.pipe(
  resolver.zod(CreateTaskParams),
  resolver.authorize(),
  async ({ description }, { session }) => {
    await db.task.create({
      data: {
        description,
        creatorId: session.userId,
        assignedUserId: session.userId,
      },
    });

    emitWithUserId(session.userId, "updatedTasks");
  },
);
