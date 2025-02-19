"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "./ui/button";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ReactCountUpWrapper from "./ReactCountWrapper";
import GetAvailableCredit from "@/actions/billing/getAvailableCredit";

const UserAvaibleCredits = () => {
  const query = useQuery({
    queryKey: ["user-available-credits"],
    refetchInterval: 30 * 1000, //30sec
    queryFn: () => GetAvailableCredit(),
  });
  return (
    <Link
      href="/billing"
      className={cn(
        "w-full space-x-2 items-center",
        buttonVariants({
          variant: "outline",
        })
      )}>
      <CoinsIcon size={20} className="text-primary" />
      <span className="font-semibold capitalize">
        {query.isLoading && <Loader2Icon className="animate-spin w-4 h-4" />}
        {!query.isLoading && query.data && (
          <ReactCountUpWrapper value={query.data} />
        )}
      </span>
    </Link>
  );
};

export default UserAvaibleCredits;
