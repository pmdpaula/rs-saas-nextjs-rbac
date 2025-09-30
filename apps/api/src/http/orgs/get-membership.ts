import { roleSchema } from "@saas/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { auth } from "../middlewares/auth";

export const getMembership = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/organizations/:slug/membership",
      {
        schema: {
          tags: ["organizations"],
          summary: "Get user membership in an organization",
          description:
            "Retrieve the membership details of the authenticated user in the specified organization.",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              membership: z.object({
                id: z.cuid(),
                role: roleSchema,
                organizationId: z.cuid(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const { membership } = await request.getUserMembership(slug);

        return reply.code(200).send({
          membership: {
            id: membership.id,
            role: membership.role,
            organizationId: membership.organizationId,
          },
        });

        // return {
        //   membership: {
        //     id: membership.id,
        //     role: membership.role,
        //     organizationId: membership.organizationId,
        //   },
        // };
      }
    );
};
