import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { createSlug } from "@/utils/create-slug";

import { auth } from "../middlewares/auth";
import { BadRequestError } from "../routes/_errors/bad-request-error";

export const createOrganization = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/organizations",
      {
        schema: {
          tags: ["organizations"],
          summary: "Create a new organization",
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          response: {
            201: z.object({
              organizationId: z.cuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const { name, domain, shouldAttachUsersByDomain } = request.body;

        if (domain) {
          const organizationByDomain = await prisma.organization.findUnique({
            where: { domain },
          });

          if (organizationByDomain) {
            throw new BadRequestError("Organization with this domain already exists");
          }
        }

        // Generate a unique slug from the organization name
        const baseSlug = createSlug(name);

        let slug = baseSlug;
        let suffix = 0;

        while (await prisma.organization.findUnique({ where: { slug } })) {
          suffix += 1;
          slug = `${baseSlug}-${suffix}`;
        }

        const organization = await prisma.organization.create({
          data: {
            name,
            slug,
            domain,
            shouldAttachUsersByDomain,
            ownerId: userId,
            members: {
              create: { userId, role: "ADMIN" },
            },
          },
        });

        return reply.status(201).send({ organizationId: organization.id });
      }
    );
};
