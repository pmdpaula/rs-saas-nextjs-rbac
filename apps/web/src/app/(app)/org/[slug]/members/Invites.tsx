import { ability, getCurrentOrganization } from "@/auth/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getInvites } from "@/http/get-invites";

import { CreateInviteForm } from "./create-invite-form";
import { RevokeInviteButton } from "./revoke-invite-button";

export const Invites = async () => {
  const currentOrg = (await getCurrentOrganization())!;
  const permissions = await ability();

  const { invites } = await getInvites(currentOrg);

  return (
    <div className="space-y-4">
      {permissions?.can("create", "Invite") && (
        <Card>
          <CardHeader>
            <CardTitle>Convidar membro</CardTitle>
          </CardHeader>

          <CardContent>
            <CreateInviteForm />
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Convites</h2>

        <div className="rounded border">
          <Table>
            <TableBody>
              {invites.map((invite) => {
                return (
                  <TableRow key={invite.id}>
                    <TableCell className="py-2.5" style={{ width: 48 }}>
                      <div className="flex flex-col">
                        <span className="text-muted-foregound">
                          {invite.email}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-2.5 font-medium">
                      {invite.role}
                    </TableCell>

                    <TableCell className="py-2.5">
                      <div className="flex justify-end">
                        {permissions?.can("delete", "Invite") && (
                          <RevokeInviteButton inviteId={invite.id} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {invites.length === 0 && (
                <TableRow>
                  <TableCell className="py-2.5 text-center text-muted-foreground">
                    Nenhum convite enviado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
