import { roleSchema } from "@saas/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";

import { auth } from "../middlewares/auth";
import { UnauthorizedError } from "../routes/_errors/unauthorized-error";

export const getMembers = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/organizations/:slug/members",
      {
        schema: {
          tags: ["members"],
          summary: "Get member details",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              members: z.array(
                z.object({
                  id: z.cuid(),
                  userId: z.cuid(),
                  role: roleSchema,
                  name: z.string().nullable(),
                  avatarUrl: z.url().nullable(),
                  email: z.email(),
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

        if (cannot("get", "User")) {
          throw new UnauthorizedError("You do not have permission to view organization members.");
        }

        const members = await prisma.member.findMany({
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            role: "asc",
          },
        });

        const membersWithRoles = members.map(({ user: { id: userId, ...user }, ...member }) => {
          return {
            ...user,
            ...member,
            userId,
          };
        });
        // if (!members) {
        //   throw new BadRequestError("Member not found or you do not have access to it.");
        // }

        return reply.code(200).send({ members: membersWithRoles });
      }
    );
};
