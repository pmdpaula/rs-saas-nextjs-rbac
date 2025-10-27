"use client";

import { AlertTriangle, Loader2, UserPlus } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormState } from "@/hook/use-form-state";

import { createInviteAction } from "./actions";

export const CreateInviteForm = () => {
  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(createInviteAction);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4 mr-2" />
          <AlertTitle>Erro ao criar convite</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {/* {success === true && message && (
        <Alert variant="success">
          <AlertTriangle className="size-4 mr-2" />
          <AlertTitle>Sucesso!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )} */}

      <div className="flex items-center gap-2">
        <div className="space-y-1 flex-1">
          {/* <Label htmlFor="email">Email</Label> */}
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="membro@exemplo.br"
          />

          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email.errors[0]}
            </p>
          )}
        </div>

        <Select name="role" defaultValue="MEMBER">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MEMBER">Membro</SelectItem>
            <SelectItem value="BILLING">Faturamento</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="size-4 mr-2" />
              Convidar usuário
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
