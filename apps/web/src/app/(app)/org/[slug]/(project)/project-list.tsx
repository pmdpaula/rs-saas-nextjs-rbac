import "dayjs/locale/pt-br";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowRight } from "lucide-react";

import { getCurrentOrganization } from "@/auth/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProjects } from "@/http/get-projects";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

export const ProjectList = async () => {
  const currentOrg = (await getCurrentOrganization())!;
  const { projects } = await getProjects(currentOrg);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => {
        return (
          <Card key={project.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="font-medium">{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>

            <CardFooter className="flex items-center gap-1.5 mt-auto">
              <Avatar className="size-4">
                {project.owner.avatarUrl && (
                  <AvatarImage src={project.owner.avatarUrl} />
                )}
                <AvatarFallback />
              </Avatar>
              <span className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {project.owner.name}
                </span>{" "}
                {dayjs(project.createdAt).fromNow()}
              </span>

              <Button variant="outline" size="xs" className="ml-auto">
                Ver <ArrowRight className="size-3 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
