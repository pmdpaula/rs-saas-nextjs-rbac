import { organizationSchema } from "@saas/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";

import { auth } from "../middlewares/auth";
import { UnauthorizedError } from "../routes/_errors/unauthorized-error";

export const shutdownOrganization = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      "/organizations/:slug",
      {
        schema: {
          tags: ["organizations"],
          summary: "Shutdown organization",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const userId = await request.getCurrentUserId();

        const { membership, organization } = await request.getUserMembership(slug);

        const authOrganization = organizationSchema.parse(organization);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot("delete", authOrganization)) {
          throw new UnauthorizedError("You do not have permission to delete this organization");
        }

        await prisma.organization.delete({
          where: { id: organization.id },
        });

        return reply.status(204).send();
      }
    );
};
