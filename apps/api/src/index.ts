import { defineAbilityFor } from "@saas/auth";

const ability = defineAbilityFor({role: "ADMIN"});

const useCanInviteSomeoneElse = ability.can("invite", "User");

console.log("🚀 ~ file: index.ts:3 ~ useCanInviteSomeoneElse:", useCanInviteSomeoneElse);
