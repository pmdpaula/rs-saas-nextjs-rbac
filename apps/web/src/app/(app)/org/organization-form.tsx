"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "@/hook/use-form-state";

import {
  createOrganizationAction,
  type OrganizationSchema,
  updateOrganizationAction,
} from "./actions";

interface OrganizationFormProps {
  isUpdating?: boolean;
  initialData?: OrganizationSchema;
}

export const OrganizationForm = ({
  isUpdating = false,
  initialData,
}: OrganizationFormProps) => {
  const formAction = isUpdating
    ? updateOrganizationAction
    : createOrganizationAction;
  // const router = useRouter();

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    formAction,
    () => {
      // router.push("/app/organizations");
    },
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4 mr-2" />
          <AlertTitle>Erro ao salvar a organização</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {success === true && message && (
        <Alert variant="success">
          <AlertTriangle className="size-4 mr-2" />
          <AlertTitle>Sucesso!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Label htmlFor="name">Nome da organização</Label>
        <Input
          type="text"
          id="name"
          name="name"
          defaultValue={initialData?.name}
        />

        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name.errors[0]}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <Label htmlFor="domain">Domínio do E-mail</Label>
        <Input
          type="text"
          id="domain"
          name="domain"
          inputMode="url"
          placeholder="exemplo.com"
          defaultValue={initialData?.domain ?? undefined}
        />

        {errors?.domain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.domain.errors[0]}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline space-x-2">
          <Checkbox
            name="shouldAttachUserByDomain"
            id="shouldAttachUserByDomain"
            className="translate-y-0.5"
            defaultChecked={initialData?.shouldAttachUsersByDomain}
          />

          <label htmlFor="shouldAttachUserByDomain" className="space-y-1">
            <span className="text-sm font-medium leading-none">
              Auto anexar novos membros pelo domínio
            </span>
            <p className="text-xs text-muted-foreground">
              Se ativado, novos membros serão automaticamente anexados à
              organização com base no domínio do e-mail.
            </p>
          </label>
        </div>

        {errors?.shouldAttachUserByDomain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.shouldAttachUserByDomain.errors[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Salvar a organização"
        )}
      </Button>
    </form>
  );
};
