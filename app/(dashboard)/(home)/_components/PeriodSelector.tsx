"use client";
import { Period } from "@/types/analytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
const MonthsOfYear = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const PeriodSelector = ({
  periods,
  periodValue,
}: {
  periods: Period[];
  periodValue: Period;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <Select
      value={`${periodValue.month} ${periodValue.year}`}
      onValueChange={(value) => {
        const [month, year] = value.split(" ");
        const params = new URLSearchParams(searchParams);
        params.set("month", month);
        params.set("year", year);
        router.push(`?${params.toString()}`);
      }}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periods.map(({ month, year }, index) => (
          <SelectItem key={index} value={`${month} ${year}`}>
            {`${MonthsOfYear[month]} ${year}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PeriodSelector;
