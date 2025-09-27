import { AbilityBuilder, CreateAbility, createMongoAbility } from "@casl/ability";
import { z } from "zod";

import { User } from "./models/user";
import { permissions } from "./permissions";
import { billingSubjectSchema } from "./subjects/billing";
import { inviteSubjectSchema } from "./subjects/invite";
import { organizationSubjectSchema } from "./subjects/organization";
import { projectSubjectSchema } from "./subjects/project";
import { userSubjectSchema } from "./subjects/user";

// function createAbilityTuples() {
//   const subjects = [
//     userSubjectSchema,
//     projectSubjectSchema,
//     billingSubjectSchema,
//     inviteSubjectSchema,
//     organizationSubjectSchema,
//   ];

//   const abilities: z.ZodType<any>[] = [];

//   // Extract all possible combinations from each subject schema
//   subjects.forEach((schema) => {
//     if (schema === userSubjectSchema) {
//       abilities.push(z.tuple([z.literal("manage"), z.literal("User")]));
//       abilities.push(z.tuple([z.literal("get"), z.literal("User")]));
//       abilities.push(z.tuple([z.literal("create"), z.literal("User")]));
//       abilities.push(z.tuple([z.literal("delete"), z.literal("User")]));
//     } else if (schema === projectSubjectSchema) {
//       abilities.push(z.tuple([z.literal("manage"), z.literal("Project")]));
//       abilities.push(z.tuple([z.literal("get"), z.literal("Project")]));
//       abilities.push(z.tuple([z.literal("create"), z.literal("Project")]));
//       abilities.push(z.tuple([z.literal("delete"), z.literal("Project")]));
//     } else if (schema === billingSubjectSchema) {
//       abilities.push(z.tuple([z.literal("manage"), z.literal("Billing")]));
//       abilities.push(z.tuple([z.literal("get"), z.literal("Billing")]));
//       abilities.push(z.tuple([z.literal("export"), z.literal("Billing")]));
//     } else if (schema === inviteSubjectSchema) {
//       abilities.push(z.tuple([z.literal("manage"), z.literal("Invite")]));
//       abilities.push(z.tuple([z.literal("get"), z.literal("Invite")]));
//       abilities.push(z.tuple([z.literal("create"), z.literal("Invite")]));
//       abilities.push(z.tuple([z.literal("delete"), z.literal("Invite")]));
//     } else if (schema === organizationSubjectSchema) {
//       abilities.push(z.tuple([z.literal("manage"), z.literal("Organization")]));
//       abilities.push(z.tuple([z.literal("get"), z.literal("Organization")]));
//       abilities.push(z.tuple([z.literal("create"), z.literal("Organization")]));
//       abilities.push(z.tuple([z.literal("delete"), z.literal("Organization")]));
//     }
//   });

//   abilities.push(z.tuple([z.literal("manage"), z.literal("all")]));

//   return z.union(abilities as any);
// }

// const appAbilitiesSchema = createAbilityTuples();

const appAbilitiesSchema = z.union([
  userSubjectSchema,
  projectSubjectSchema,
  billingSubjectSchema,
  inviteSubjectSchema,
  organizationSubjectSchema,

  z.tuple([z.literal("manage"), z.literal("all")]),
]);

type AppAbilities = z.infer<typeof appAbilitiesSchema>;

export type AppAbility = CreateAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility);

  if (typeof permissions[user.role] !== "function") {
    throw new Error(`Permissions for role ${user.role} not found`);
  }

  permissions[user.role](user, builder);

  const ability = builder.build();

  return ability;
}
