import { projectSchema } from "@saas/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";

import { auth } from "../middlewares/auth";
import { BadRequestError } from "../routes/_errors/bad-request-error";
import { UnauthorizedError } from "../routes/_errors/unauthorized-error";

export const updateProject = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      "/organizations/:slug/projects/:projectId",
      {
        schema: {
          tags: ["projects"],
          summary: "Update a project details",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            projectId: z.cuid(),
          }),
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, projectId } = request.params;
        const userId = await request.getCurrentUserId();
        const { membership, organization } = await request.getUserMembership(slug);

        const project = await prisma.project.findUnique({
          where: {
            id: projectId,
            organizationId: organization.id,
          },
        });

        if (!project) {
          throw new BadRequestError("Project not found in this organization.");
        }

        const { cannot } = await getUserPermissions(userId, membership.role);
        const authProject = projectSchema.parse(project);

        if (cannot("update", authProject)) {
          throw new UnauthorizedError("You do not have permission to update this project.");
        }

        const { name, description } = request.body;

        await prisma.project.update({
          where: {
            id: projectId,
          },
          data: {
            name,
            description,
          },
        });

        return reply.status(204).send();
      }
    );
};
