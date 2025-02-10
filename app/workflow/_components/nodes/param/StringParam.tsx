import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { paramProps } from "@/types/appNode";
import { useEffect, useId, useState } from "react";

const StringParam = ({
  params,
  updateNodeParamValue,
  value,
  disabled,
}: paramProps) => {
  const id = useId();
  const [internalValue, setInternalValue] = useState(value);
  useEffect(() => {
    setInternalValue(value);
  }, [value]);
  let Component: any = Input;
  if (params.variant === "textarea") {
    Component = Textarea;
  }
  return (
    <div className="space-y-1 p-1 w-full">
      <label htmlFor={id} className="text-xs flex">
        {params.name}
        {params.required && <span className="text-red-400 px-2">*</span>}
      </label>
      <Component
        id={id}
        value={internalValue}
        disabled={disabled}
        onChange={(e: any) => setInternalValue(e.target.value)}
        onBlur={(e: any) => updateNodeParamValue(e.target.value)}
      />
      {params.helperText && (
        <p className="text-muted-foreground px-2">{params.helperText}</p>
      )}
    </div>
  );
};

export default StringParam;
