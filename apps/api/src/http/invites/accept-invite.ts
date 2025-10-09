import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import prisma from "@/lib/prisma";

import { auth } from "../middlewares/auth";
import { BadRequestError } from "../routes/_errors/bad-request-error";

export const acceptInvite = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/invites/:inviteId/accept",
      {
        schema: {
          tags: ["invites"],
          summary: "Get an invite",
          params: z.object({
            inviteId: z.cuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const { inviteId } = request.params;

        const invite = await prisma.invite.findUnique({
          where: { id: inviteId },
        });

        if (!invite) {
          throw new BadRequestError("Invite not found or expired.");
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new BadRequestError("User not found.");
        }

        if (user.email !== invite.email) {
          throw new BadRequestError("This invite is not for your email.");
        }

        await prisma.$transaction(async () => {
          prisma.member.create({
            data: {
              userId,
              organizationId: invite.organizationId,
              role: invite.role,
            },
          });

          prisma.invite.delete({
            where: { id: inviteId },
          });
        });

        return reply.status(204).send();
      }
    );
};
