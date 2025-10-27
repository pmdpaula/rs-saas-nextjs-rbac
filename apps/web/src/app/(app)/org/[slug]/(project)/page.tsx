import { Plus } from "lucide-react";
import Link from "next/link";

import { ability, getCurrentOrganization } from "@/auth/auth";
import { Button } from "@/components/ui/button";

import { ProjectList } from "./project-list";

const Projects = async () => {
  const currentOrg = (await getCurrentOrganization())!;
  const permissions = await ability();

  // if (permissions?.cannot("get", "Project")) {
  //   redirect(`/org/${currentOrg}/billing`);
  // }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projetos da organização</h1>

        {permissions?.can("create", "Project") && (
          <Button size="sm" asChild>
            <Link href={`/org/${currentOrg}/create-project`}>
              <Plus />
              Novo Projeto
            </Link>
          </Button>
        )}
      </div>

      {permissions?.can("get", "Project") ? (
        <ProjectList />
      ) : (
        <p className="text-sm">Você não tem permissão para ver os projetos.</p>
      )}
    </div>
  );
};

export default Projects;
