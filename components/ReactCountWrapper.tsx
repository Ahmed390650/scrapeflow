"use client";
import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
const ReactCountUpWrapper = ({ value }: { value: number }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return "-";
  return (
    <CountUp
      decimals={0}
      preserveValue
      end={value}
      duration={0.5}
      className="text-primary font-bold"
    />
  );
};

export default ReactCountUpWrapper;
