import { Input } from "@/components/ui/input";
import { paramProps } from "@/types/appNode";
import { useId, useState } from "react";

const StringParam = ({ params, updateNodeParamValue, value }: paramProps) => {
  const id = useId();
  const [internalValue, setInternalValue] = useState(value || "");
  return (
    <div className="space-y-1 p-1 w-full">
      <label htmlFor={id} className="text-xs flex">
        {params.name}
        {params.required && <span className="text-red-400 px-2">*</span>}
      </label>
      <Input
        id={id}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={(e) => updateNodeParamValue(e.target.value)}
      />
      {params.helperText && (
        <p className="text-muted-foreground px-2">{params.helperText}</p>
      )}
    </div>
  );
};

export default StringParam;
