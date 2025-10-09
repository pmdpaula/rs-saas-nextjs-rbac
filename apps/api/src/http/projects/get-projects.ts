import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";

import { auth } from "../middlewares/auth";
import { UnauthorizedError } from "../routes/_errors/unauthorized-error";

export const getProjects = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/organizations/:slug/projects",
      {
        schema: {
          tags: ["projects"],
          summary: "Get all organization projects",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              projects: z.array(
                z.object({
                  id: z.cuid(),
                  name: z.string(),
                  slug: z.string(),
                  description: z.string(),
                  ownerId: z.cuid(),
                  avatarUrl: z.url().nullable(),
                  organizationId: z.cuid(),
                  createdAt: z.date(),
                  owner: z.object({
                    id: z.cuid(),
                    name: z.string().nullable(),
                    avatarUrl: z.url().nullable(),
                  }),
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const userId = await request.getCurrentUserId();
        const { organization, membership } = await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot("get", "Project")) {
          throw new UnauthorizedError("You do not have permission to view organization projects.");
        }

        const projects = await prisma.project.findMany({
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            ownerId: true,
            avatarUrl: true,
            organizationId: true,
            createdAt: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            organizationId: organization.id,
          },
          orderBy: { createdAt: "desc" },
        });

        return reply.code(200).send({ projects });
      }
    );
};
