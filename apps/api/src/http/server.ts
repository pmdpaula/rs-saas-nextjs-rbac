import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { env } from "@saas/env";
import { fastify } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import { getOrganizationBilling } from "./billing/get-organization-billing";
import { errorHandler } from "./error-handler";
import { acceptInvite } from "./invites/accept-invite";
import { createInvite } from "./invites/create-invite";
import { getInvite } from "./invites/get-invite";
import { getInvites } from "./invites/get-invites";
import { getPendingInvites } from "./invites/get-pending-invites";
import { rejectInvite } from "./invites/reject-invite";
import { revokeInvite } from "./invites/revoke-invite";
import { removeMember } from "./members/delete-member";
import { getMembers } from "./members/get-members";
import { updateMember } from "./members/update-member";
import { createOrganization } from "./orgs/create-organization";
import { getMembership } from "./orgs/get-membership";
import { getOrganization } from "./orgs/get-organization";
import { getOrganizations } from "./orgs/get-organizations";
import { shutdownOrganization } from "./orgs/shutdown-organization";
import { transferOrganization } from "./orgs/transfer-organization";
import { updateOrganization } from "./orgs/update-organization";
import { createProject } from "./projects/create-project";
import { deleteProject } from "./projects/delete-project";
import { getProject } from "./projects/get-project";
import { getProjects } from "./projects/get-projects";
import { updateProject } from "./projects/update-project";
import { authenticateWithGithub } from "./routes/auth/authenticate-wit-github";
import { authenticateWithPassword } from "./routes/auth/authenticate-with-password";
import { createAccount } from "./routes/auth/create-account";
import { getProfile } from "./routes/auth/get-profile";
import { requestPasswordRecover } from "./routes/auth/request-password-recover";
import { resetPassword } from "./routes/auth/reset-password";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Next.js SaaS",
      description: "Full-Stack SaaS app with multi-tenancy and RBAC",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(fastifyCors, {
  origin: "*",
});

app.register(createAccount);
app.register(authenticateWithPassword);
app.register(authenticateWithGithub);
app.register(getProfile);
app.register(requestPasswordRecover);
app.register(resetPassword);

app.register(createOrganization);
app.register(getMembership);
app.register(getOrganizations);
app.register(getOrganization);
app.register(updateOrganization);
app.register(shutdownOrganization);
app.register(transferOrganization);

app.register(createProject);
app.register(deleteProject);
app.register(getProject);
app.register(getProjects);
app.register(updateProject);

app.register(getMembers);
app.register(updateMember);
app.register(removeMember);

app.register(createInvite);
app.register(getInvite);
app.register(getInvites);
app.register(acceptInvite);
app.register(rejectInvite);
app.register(revokeInvite);
app.register(getPendingInvites);

app.register(getOrganizationBilling);

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log(`HTTP server running on http://localhost:${env.PORT}`);
});
