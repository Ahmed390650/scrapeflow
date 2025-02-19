"use client";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import SaveBtn from "./SaveBtn";
import ExecutionBtn from "./ExecutionBtn";
import NavigationTab from "./NavigationTab";
interface Props {
  title: string;
  subTitle?: string;
  workflowId: string;
  hideButton?: boolean;
}
const Topbar = ({ subTitle, title, workflowId, hideButton = false }: Props) => {
  const router = useRouter();
  return (
    <header className="flex p-2 border-b-2 border-separate w-full h-[60px] justify-between sticky bg-background z-10 top-0">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="Back">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              router.back();
            }}>
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subTitle && (
            <p className="text-xs text-muted-foreground truncate text-ellipsis">
              {subTitle}
            </p>
          )}
        </div>
      </div>
      <NavigationTab workflowId={workflowId} />
      <div className="flex gap-1 justify-end flex-1">
        {!hideButton && (
          <>
            <ExecutionBtn workflowId={workflowId} />
            <SaveBtn workflowId={workflowId} />
          </>
        )}
      </div>
    </header>
  );
};

export default Topbar;
