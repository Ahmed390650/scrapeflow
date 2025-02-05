"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList } from "./ui/breadcrumb";
import { MobileSidebar } from "./Sidebar";

const BreadcrumbHeader = () => {
  const pathname = usePathname();
  const paths = pathname === "/" ? [""] : pathname?.split("/");
  return (
    <div className="flex items-center justify-start">
      <MobileSidebar />
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => (
            <React.Fragment key={index}>
              <BreadcrumbLink className="capitalize" href={`/${path}`}>
                {path === "" ? "Home" : path}
              </BreadcrumbLink>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbHeader;
