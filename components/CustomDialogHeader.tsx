import { LucideIcon } from "lucide-react";
import React from "react";
import { DialogHeader } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
interface Props {
  Icon?: LucideIcon;
  title?: string;
  subTitle?: string;

  IconClassName?: string;
  titleClassName?: string;
  subTitleClassName?: string;
}
const CustomDialogHeader = ({
  Icon,
  subTitle,
  title,
  IconClassName,
  subTitleClassName,
  titleClassName,
}: Props) => {
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild>
        <div className="flex flex-col gap-2 items-center mb-5">
          {Icon && (
            <Icon size={30} className={cn("stroke-primary", IconClassName)} />
          )}
          {title && (
            <p className={cn("text-xl text-primary", titleClassName)}>
              {title}
            </p>
          )}
          {subTitle && (
            <p
              className={cn(
                "text-sm text-muted-foreground",
                subTitleClassName
              )}>
              {subTitle}
            </p>
          )}
        </div>
      </DialogTitle>
      <Separator />
    </DialogHeader>
  );
};

export default CustomDialogHeader;
