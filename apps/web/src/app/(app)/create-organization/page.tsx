import { Header } from "@/components/header";

import { OrganizationForm } from "./organization-form";

const CreateOrganization = () => {
  return (
    <div className="py-4 space-y-4">
      <Header />

      <main className="mx-auto w-full max-w-[1200px] px-1">
        <OrganizationForm />
      </main>
    </div>
  );
};

export default CreateOrganization;
