import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/ThemeButtonToggle";
import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";
const layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col w-full h-screen ">
      {children}
      <Separator />
      <footer className="flex items-center justify-between p-4 ">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <ModeToggle />
        </div>
      </footer>
    </main>
  );
};
export default layout;
