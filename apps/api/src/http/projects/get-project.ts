import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";

import { auth } from "../middlewares/auth";
import { BadRequestError } from "../routes/_errors/bad-request-error";
import { UnauthorizedError } from "../routes/_errors/unauthorized-error";

export const getProject = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/organizations/:orgSlug/projects/:projectSlug",
      {
        schema: {
          tags: ["projects"],
          summary: "Get project details",
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
          response: {
            200: z.object({
              project: z.object({
                id: z.cuid(),
                name: z.string(),
                slug: z.string(),
                description: z.string(),
                ownerId: z.cuid(),
                avatarUrl: z.url().nullable(),
                organizationId: z.cuid(),
                owner: z.object({
                  id: z.cuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.url().nullable(),
                }),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { orgSlug, projectSlug } = request.params;
        const userId = await request.getCurrentUserId();
        const { organization, membership } = await request.getUserMembership(orgSlug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot("get", "Project")) {
          throw new UnauthorizedError("You do not have permission to view this project.");
        }

        const project = await prisma.project.findFirst({
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            ownerId: true,
            avatarUrl: true,
            organizationId: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            slug: projectSlug,
            organizationId: organization.id,
          },
        });

        if (!project) {
          throw new BadRequestError("Project not found or you do not have access to it.");
        }

        return reply.code(200).send({ project });
      }
    );
};
