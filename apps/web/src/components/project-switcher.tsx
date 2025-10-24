"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, Loader2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { getProjects } from "@/http/get-projects";

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
import { Skeleton } from "./ui/skeleton";

export const ProjectSwitcher = () => {
  const { slug: orgSlug, project: projectSlug } = useParams<{
    slug: string;
    project: string;
  }>();

  const { data, isLoading } = useQuery({
    queryKey: [orgSlug, "projects"],
    queryFn: () => getProjects(orgSlug),
    enabled: !!orgSlug,
  });

  const currentProject =
    data && projectSlug
      ? data.projects.find((project) => project.slug === projectSlug)
      : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[210px] items-center gap-2 rounded p-1 text-small font-medium outline-none focus-visivble:ring-2 focus-visible:ring-primary">
        {isLoading ? (
          <>
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-4 w-full flex-1" />
          </>
        ) : (
          <>
            {currentProject ? (
              <>
                <Avatar className="mr-2 size-4">
                  {currentProject.avatarUrl && (
                    <AvatarImage src={currentProject.avatarUrl} />
                  )}
                  <AvatarFallback />
                </Avatar>
                <span className="truncate text-left">
                  {currentProject.name}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">
                Selecione um projeto
              </span>
            )}
          </>
        )}
        {isLoading ? (
          <Loader2 className="ml-auto size-4 text-muted-foreground shrink-0 animate-spin" />
        ) : (
          <ChevronsUpDown className="ml-auto size-4 text-muted-foreground shrink-0" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[240px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projetos</DropdownMenuLabel>
          {data &&
            data.projects.map((project) => (
              <DropdownMenuItem key={project.id} asChild>
                <a href={`/org/${orgSlug}/project/${project.slug}`}>
                  <Avatar className="size-4">
                    {project.avatarUrl && (
                      <AvatarImage src={project.avatarUrl} />
                    )}
                    <AvatarFallback />
                  </Avatar>

                  <span className="line-clamp-1">{project.name}</span>
                </a>
              </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/org/${orgSlug}/create-project`}>
            <PlusCircle className="size-4 mr-2" />
            Criar novo projeto
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
