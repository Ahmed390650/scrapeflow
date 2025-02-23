import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
const NavigationTab = ({ workflowId }: { workflowId: string }) => {
  const pathName = usePathname();

  const activeValue =
    pathName.split("/").length === 4 ? pathName.split("/")[2] : undefined;
  return (
    <Tabs value={activeValue} className="w-[400px]">
      <TabsList className="grid grid-cols-2 w-full ">
        <Link href={`/workflow/editor/${workflowId}`}>
          <TabsTrigger value="editor" className="w-full">
            Editor
          </TabsTrigger>
        </Link>
        <Link href={`/workflow/runs/${workflowId}`}>
          <TabsTrigger value="runs" className="w-full">
            Runs
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
};

export default NavigationTab;
