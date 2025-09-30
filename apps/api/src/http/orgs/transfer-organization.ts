import { organizationSchema } from "@saas/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";

import { auth } from "../middlewares/auth";
import { BadRequestError } from "../routes/_errors/bad-request-error";
import { UnauthorizedError } from "../routes/_errors/unauthorized-error";

export const transferOrganization = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      "/organizations/:slug/owner",
      {
        schema: {
          tags: ["organizations"],
          summary: "Transfer organization ownership",
          security: [{ bearerAuth: [] }],
          body: z.object({
            transferToUserId: z.cuid(),
          }),
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

        if (cannot("transfer_ownership", authOrganization)) {
          throw new UnauthorizedError(
            "You do not have permission to transfer ownership of this organization"
          );
        }

        const { transferToUserId } = request.body;

        const transferToMembership = await prisma.member.findUnique({
          where: {
            user_organization_idx: {
              organizationId: organization.id,
              userId: transferToUserId,
            },
          },
        });

        if (!transferToMembership) {
          throw new BadRequestError("Target user is not a member of the organization");
        }

        await prisma.$transaction([
          prisma.member.update({
            where: {
              user_organization_idx: {
                organizationId: organization.id,
                userId: transferToUserId,
              },
            },
            data: {
              role: "ADMIN",
            },
          }),
          prisma.organization.update({
            where: { id: organization.id },
            data: {
              ownerId: transferToUserId,
            },
          }),
        ]);

        return reply.status(204).send();
      }
    );
};
