import { ChevronsUpDown, PlusCircle } from "lucide-react";
import Link from "next/link";

import { getCurrentOrganization } from "@/auth/auth";
import { getOrganizations } from "@/http/get-organizations";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const OrganizationSwitcher = async () => {
  const currentOrg = await getCurrentOrganization();
  const { organizations } = await getOrganizations();

  const currentOrganization = organizations.find(
    (org) => org.slug === currentOrg,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[210px] items-center gap-2 rounded p-1 text-small font-medium outline-none focus-visivble:ring-2 focus-visible:ring-primary">
        {currentOrganization ? (
          <>
            <Avatar className="size-4">
              {currentOrganization.avatarUrl && (
                <AvatarImage src={currentOrganization.avatarUrl} />
              )}
              <AvatarFallback />
            </Avatar>
            <span className="truncate text-left">
              {currentOrganization.name}
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">Selecione a organização</span>
        )}
        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[240px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizações</DropdownMenuLabel>
          {organizations.map((org) => (
            <DropdownMenuItem key={org.id} asChild>
              <a href={`/org/${org.slug}`}>
                <Avatar className="mr-2 size-4">
                  {org.avatarUrl && <AvatarImage src={org.avatarUrl} />}
                  <AvatarFallback />
                </Avatar>
                <span className="line-clamp-1">{org.name}</span>
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/create-organization">
            <PlusCircle className="size-4 mr-2" />
            Criar nova organização
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
