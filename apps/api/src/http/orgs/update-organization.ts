import { organizationSchema } from "@saas/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";

import { auth } from "../middlewares/auth";
import { BadRequestError } from "../routes/_errors/bad-request-error";
import { UnauthorizedError } from "../routes/_errors/unauthorized-error";

export const updateOrganization = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      "/organizations/:slug",
      {
        schema: {
          tags: ["organizations"],
          summary: "Update organization details",
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
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
        const { name, domain, shouldAttachUsersByDomain } = request.body;

        const authOrganization = organizationSchema.parse(organization);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot("update", authOrganization)) {
          throw new UnauthorizedError("You do not have permission to update this organization");
        }

        if (domain) {
          const organizationByDomain = await prisma.organization.findFirst({
            where: { domain, id: { not: organization.id } },
          });

          if (organizationByDomain) {
            throw new BadRequestError("Organization with this domain already exists");
          }
        }

        await prisma.organization.update({
          where: { id: organization.id },
          data: {
            name,
            // slug,
            domain,
            shouldAttachUsersByDomain,
          },
        });

        return reply.status(204).send();
      }
    );
};
