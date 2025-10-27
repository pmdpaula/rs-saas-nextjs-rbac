import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";

import { auth } from "../middlewares/auth";
import { BadRequestError } from "../routes/_errors/bad-request-error";
import { UnauthorizedError } from "../routes/_errors/unauthorized-error";

export const revokeInvite = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      "/organizations/:slug/invites/:inviteId",
      {
        schema: {
          tags: ["invites"],
          summary: "Revoke an invite",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            inviteId: z.cuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, inviteId } = request.params;
        const userId = await request.getCurrentUserId();
        const { membership, organization } = await request.getUserMembership(slug);

        const { cannot } = await getUserPermissions(userId, membership.role);

        if (cannot("delete", "Invite")) {
          throw new UnauthorizedError("You do not have permission to delete invites.");
        }

        const existingInvite = await prisma.invite.findUnique({
          where: {
            id: inviteId,
            organizationId: organization.id,
          },
        });

        if (!existingInvite) {
          throw new BadRequestError(`No invite found.`);
        }

        await prisma.invite.delete({
          where: { id: inviteId },
        });

        return reply.status(204).send();
      }
    );
};
