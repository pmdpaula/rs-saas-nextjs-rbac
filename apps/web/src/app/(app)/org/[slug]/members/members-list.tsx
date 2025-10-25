import { organizationSchema } from "@saas/auth";
import { ArrowLeftRight, Crown, UserMinus } from "lucide-react";
import Image from "next/image";

import { ability, getCurrentOrganization } from "@/auth/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getMembers } from "@/http/get-members";
import { getMembership } from "@/http/get-membership";
import { getOrganization } from "@/http/get-organization";

import { removeMemberAction } from "./actions";

export const MembersList = async () => {
  const currentOrg = (await getCurrentOrganization())!;
  const permissions = await ability();

  const [{ members }, { membership }, { organization }] = await Promise.all([
    getMembers(currentOrg),
    getMembership(currentOrg),
    getOrganization(currentOrg),
  ]);

  const authOrganization = organizationSchema.parse(organization);

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Membros</h2>

      <div className="rounded border">
        <Table>
          <TableBody>
            {members.map((member) => {
              return (
                <TableRow key={member.id}>
                  <TableCell className="py-2.5" style={{ width: 48 }}>
                    <Avatar>
                      <AvatarFallback />
                      {member.avatarUrl && (
                        <Image
                          src={member.avatarUrl}
                          alt=""
                          width={32}
                          height={32}
                          className="aspect-squere size-full"
                        />
                      )}
                    </Avatar>
                  </TableCell>

                  <TableCell className="py-2.5">
                    <div className="flex flex-col">
                      <span className="font-medium inline-flex items-center gap-2">
                        {member.name}
                        {membership.userId === member.userId && " (você)"}
                        {organization.ownerId === member.userId && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Crown className="size-3 " />
                            proprietário
                          </span>
                        )}
                      </span>
                      <span className="text-muted-foreground">
                        {member.email}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      {permissions?.can(
                        "transfer_ownership",
                        authOrganization,
                      ) && (
                        <Button size="sm" variant="ghost">
                          <ArrowLeftRight className="mr-2 size-4 text-muted-foreground" />
                          Transferir propriedade
                        </Button>
                      )}

                      {permissions?.can("delete", "User") && (
                        <form action={removeMemberAction.bind(null, member.id)}>
                          <Button
                            disabled={
                              member.userId === membership.userId ||
                              member.userId === organization.ownerId
                            }
                            type="submit"
                            size="sm"
                            variant="destructive"
                          >
                            <UserMinus className="mr-2 size-4 text-muted-foreground" />
                            Remover
                          </Button>
                        </form>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
