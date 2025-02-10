"use client";

import { paramProps } from "@/types/appNode";

const BrowserInstanceParam = ({ params }: paramProps) => {
  return <p className="text-xs ">{params.name}</p>;
};

export default BrowserInstanceParam;
