import { ability, getCurrentOrganization } from "@/auth/auth";

import { NavLink } from "./NavLink";
import { Button } from "./ui/button";

export const Tabs = async () => {
  const currentOrg = (await getCurrentOrganization())!;

  const permissions = await ability();

  const canUpdateOrganization = permissions?.can("update", "Organization");
  const canGetBilling = permissions?.can("get", "Billing");
  const canGetMembers = permissions?.can("get", "User");
  const canGetProjects = permissions?.can("get", "Project");

  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-[1200px] items-center gap-2">
        {canGetProjects && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border"
          >
            <NavLink href={`/org/${currentOrg}`}>Projetos</NavLink>
          </Button>
        )}

        {canGetMembers && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border"
          >
            <NavLink href={`/org/${currentOrg}/members`}>Membros</NavLink>
          </Button>
        )}

        {(canUpdateOrganization || canGetBilling) && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border"
          >
            <NavLink href={`/org/${currentOrg}/settings`}>
              Configurações e faturamento
            </NavLink>
          </Button>
        )}
      </nav>
    </div>
  );
};
