"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";

const TaskMenu = () => {
  return (
    <aside className="flex-2 w-[340px] min-w-[40px] max-w-[340px]  border-r-2 border-separate h-full p-2 px-4 overflow-auto">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["extraction"]}>
        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold">
            Data Extraction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
            <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
};

export default TaskMenu;
const TaskMenuBtn = ({ taskType }: { taskType: TaskType }) => {
  const { Icon, label } = TaskRegistry[taskType];
  const onDragStart = (e: React.DragEvent, type: TaskType) => {
    e.dataTransfer.setData("application/reactflow", type);
    e.dataTransfer.effectAllowed = "move";
  };
  return (
    <Button
      variant="secondary"
      draggable
      onDragStart={(e) => onDragStart(e, taskType)}
      className="flex items-center justify-between gap-2 border w-full">
      <div className="flex gap-2">
        <Icon size={20} />
        {label}
      </div>
    </Button>
  );
};
