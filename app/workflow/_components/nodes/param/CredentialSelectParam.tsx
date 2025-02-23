"use client";
import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { paramProps } from "@/types/appNode";
import { useQuery } from "@tanstack/react-query";
import { useId } from "react";

const CredentialSelectParam = ({
  params,
  updateNodeParamValue,
  value,
}: paramProps) => {
  const id = useId();
  const { data } = useQuery({
    queryKey: ["credentials-for-users"],
    queryFn: () => GetCredentialsForUser(),
  });
  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {params.name}
        {params.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Select
        value={value}
        onValueChange={(value) => updateNodeParamValue(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {data?.map((credential) => (
              <SelectItem key={credential.id} value={credential.id}>
                {credential.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CredentialSelectParam;
