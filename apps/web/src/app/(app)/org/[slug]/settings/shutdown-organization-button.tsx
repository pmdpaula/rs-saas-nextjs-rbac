import { XCircle } from "lucide-react";
import { redirect } from "next/navigation";

import { getCurrentOrganization } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { shutdownOrganization } from "@/http/shutdown-organization";

export const ShutdownOrganizationButton = () => {
  async function shutdownOrganizationAction() {
    "use server";

    const currentOrganization = await getCurrentOrganization();

    await shutdownOrganization({ org: currentOrganization! });

    redirect("/");
  }

  return (
    <form action={shutdownOrganizationAction}>
      <Button type="submit" variant="destructive" className="w-56">
        <XCircle className="size-4 mr-2" />
        Encerrar Organização
      </Button>
    </form>
  );
};
