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
          throw new UnauthorizedError("Você não tem permissão para criar convites.");
        }

        const { email, role } = request.body;

        const [, domain] = email.split("@");

        if (organization.shouldAttachUsersByDomain && domain === organization.domain) {
          throw new BadRequestError(
            `Usuários com domínio "${domain}" podem se juntar à organização por conta própria.`
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
          throw new BadRequestError(`Um convite já foi enviado para ${email}.`);
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
          throw new BadRequestError(`${email} já é um membro da organização.`);
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
