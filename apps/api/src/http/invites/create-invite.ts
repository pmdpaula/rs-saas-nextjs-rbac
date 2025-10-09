import { roleSchema } from "@saas/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";

import { auth } from "../middlewares/auth";
import { BadRequestError } from "../routes/_errors/bad-request-error";
import { UnauthorizedError } from "../routes/_errors/unauthorized-error";

export const createInvite = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/organizations/:slug/invites",
      {
        schema: {
          tags: ["invites"],
          summary: "Create a new invite",
          security: [{ bearerAuth: [] }],
          body: z.object({
            email: z.email(),
            role: roleSchema,
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              inviteId: z.cuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const userId = await request.getCurrentUserId();
        const { membership, organization } = await request.getUserMembership(slug);

        const { cannot } = await getUserPermissions(userId, membership.role);

        if (cannot("create", "Invite")) {
          throw new UnauthorizedError("You do not have permission to create invites.");
        }

        const { email, role } = request.body;

        const [, domain] = email;

        if (organization.shouldAttachUsersByDomain && domain === organization.domain) {
          throw new BadRequestError(
            `User with "${domain}" domain can join the organization by themself.`
          );
        }

        const existingInvite = await prisma.invite.findUnique({
          where: {
            email_organization_idx: {
              email,
              organizationId: organization.id,
            },
          },
        });

        if (existingInvite) {
          throw new BadRequestError(`An invite has already been sent to ${email}.`);
        }

        const memberWithSameEmail = await prisma.member.findFirst({
          where: {
            organizationId: organization.id,
            user: {
              email,
            },
          },
        });

        if (memberWithSameEmail) {
          throw new BadRequestError(`${email} is already a member of the organization.`);
        }

        const invite = await prisma.invite.create({
          data: {
            email,
            role,
            organizationId: organization.id,
            authorId: userId,
          },
        });

        return reply.status(201).send({ inviteId: invite.id });
      }
    );
};
