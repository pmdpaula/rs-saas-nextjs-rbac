import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";

import { auth } from "../middlewares/auth";
import { UnauthorizedError } from "../routes/_errors/unauthorized-error";

export const removeMember = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      "/organizations/:slug/members/:memberId",
      {
        schema: {
          tags: ["members"],
          summary: "Remove a member from the organization.",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.cuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, memberId } = request.params;
        const userId = await request.getCurrentUserId();
        const { organization, membership } = await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot("delete", "User")) {
          throw new UnauthorizedError(
            "You do not have permission to delete this member from the organization."
          );
        }

        await prisma.member.delete({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
        });

        return reply.status(204).send();
      }
    );
};
