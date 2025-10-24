import { ProjectForm } from "@/app/(app)/org/[slug]/create-project/project-form";
import { InterceptedSheetContent } from "@/components/intercepted-sheet-content";
import { Sheet, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const CreateProject = () => {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent side="right">
        <SheetHeader>
          <SheetTitle>Criar um Projeto</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <ProjectForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  );
};

export default CreateProject;
