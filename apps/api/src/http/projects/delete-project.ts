import { projectSchema } from "@saas/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";

import { auth } from "../middlewares/auth";
import { BadRequestError } from "../routes/_errors/bad-request-error";
import { UnauthorizedError } from "../routes/_errors/unauthorized-error";

export const deleteProject = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      "/organizations/:slug/projects/:projectId",
      {
        schema: {
          tags: ["projects"],
          summary: "Delete a project",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            projectId: z.cuid(),
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

        const project = await prisma.project.findFirst({
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

        if (cannot("delete", authProject)) {
          throw new UnauthorizedError("You do not have permission to delete this project.");
        }

        await prisma.project.delete({
          where: {
            id: projectId,
            organizationId: organization.id,
          },
        });

        return reply.status(204).send();
      }
    );
};
