import { ability, getCurrentOrganization } from "@/auth/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOrganization } from "@/http/get-organization";

import { OrganizationForm } from "../../organization-form";
import { ShutdownOrganizationButton } from "./shutdown-organization-button";

const Settings = async () => {
  const currentOrg = (await getCurrentOrganization())!;
  const permissions = await ability();

  const canUpdateOrganization = permissions?.can("update", "Organization");
  const canGetBilling = permissions?.can("get", "Billing");
  const canShutdownOrganization = permissions?.can("delete", "Organization");

  const { organization } = await getOrganization(currentOrg);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <div className="space-y-4">
        {canUpdateOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Configuração da organização</CardTitle>
              <CardDescription>
                Gerencie as configurações da sua organização.
              </CardDescription>

              <CardContent>
                <OrganizationForm
                  isUpdating
                  initialData={{
                    name: organization.name,
                    domain: organization.domain,
                    shouldAttachUsersByDomain:
                      organization.shouldAttachUsersByDomain,
                  }}
                />
              </CardContent>
            </CardHeader>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        {canGetBilling && (
          <Card>
            <CardHeader>
              <CardTitle>Configuração de cobrança</CardTitle>
              <CardDescription>
                Gerencie as configurações de cobrança da sua organização.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p>Conteúdo da configuração de cobrança.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        {canShutdownOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Encerrar organização</CardTitle>
              <CardDescription>
                Encerre sua organização e exclua todos os dados associados. Não
                é possível desfazer esta ação.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ShutdownOrganizationButton />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Settings;
