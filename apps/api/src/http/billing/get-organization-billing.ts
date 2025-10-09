import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";

import { auth } from "../middlewares/auth";
import { UnauthorizedError } from "../routes/_errors/unauthorized-error";

export const getOrganizationBilling = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/organizations/:slug/billing",
      {
        schema: {
          tags: ["billing"],
          summary: "Get billing information for an organization.",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              billing: z.object({
                seats: z.object({
                  amount: z.number().int().min(0).describe("Number of user seats"),
                  unit: z.number().int().min(0).describe("Price per user seat in USD"),
                  price: z.number().int().min(0).describe("Total price for user seats in USD"),
                }),
                projects: z.object({
                  amount: z.number().int().min(0).describe("Number of projects"),
                  unit: z.number().int().min(0).describe("Price per project in USD"),
                  price: z.number().int().min(0).describe("Total price for projects in USD"),
                }),
                total: z.number().int().min(0).describe("Total price for the organization in USD"),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const userId = await request.getCurrentUserId();
        const { organization, membership } = await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot("get", "Billing")) {
          throw new UnauthorizedError(
            "You do not have access to view billing information for this organization."
          );
        }

        const [amountOfMembers, amountOfProjects] = await Promise.all([
          prisma.member.count({
            where: {
              organizationId: organization.id,
              role: { not: "BILLING" },
            },
          }),

          prisma.project.count({
            where: { organizationId: organization.id },
          }),
        ]);

        return reply.code(200).send({
          billing: {
            seats: {
              amount: amountOfMembers,
              unit: 10,
              price: amountOfMembers * 10,
            },
            projects: {
              amount: amountOfProjects,
              unit: 20,
              price: amountOfProjects * 20,
            },
            total: amountOfMembers * 10 + amountOfProjects * 20,
          },
        });
      }
    );
};
