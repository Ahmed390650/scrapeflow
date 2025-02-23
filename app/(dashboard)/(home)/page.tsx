import { GetPeriods } from "@/actions/analytics/getPeriods";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import PeriodSelector from "./_components/PeriodSelector";
import { Period } from "@/types/analytics";
import { waitFor } from "@/lib/helper/waitFor";
import { GetStatsCardValues } from "@/actions/analytics/getStatsCardValues";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import StatsCard from "./_components/StatsCard";
import { GetWorkExecutionStatus } from "@/actions/analytics/getWorkExecutionStatus";
import ExecutionStatusChart from "./_components/ExecutionStatusChart";
import ChartCreditPeriod from "../billing/_components/ChartCreditPeriod";
import { GetCreditUsageInPeriod } from "@/actions/analytics/getCreditUsageInPeriod";

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const currentDate = new Date();
  const { month, year } = await searchParams;
  const period: Period = {
    month: month ? +month : currentDate.getMonth(),
    year: year ? +year : currentDate.getFullYear(),
  };

  return (
    <div className="flex flex-1 h-full flex-col">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectorWrapper periodValue={period} />
        </Suspense>
      </div>
      <div className=" h-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <StateExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <CreditUsageInPeriod selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  );
}
const PeriodSelectorWrapper = async ({
  periodValue,
}: {
  periodValue: Period;
}) => {
  const periods = await GetPeriods();
  return <PeriodSelector periods={periods} periodValue={periodValue} />;
};
const StatsCards = async ({ selectedPeriod }: { selectedPeriod: Period }) => {
  const { creditsConsumed, phaseExecution, workflowExecutions } =
    await GetStatsCardValues(selectedPeriod);
  return (
    <div className="grid lg:grid-cols-3 lg:gap-8 gap-3 min-h-[120px]">
      <StatsCard
        title="Workflow executions"
        value={workflowExecutions}
        Icon={CirclePlayIcon}
      />
      <StatsCard
        title="Phase executions"
        value={phaseExecution}
        Icon={WaypointsIcon}
      />
      <StatsCard
        title="Credits executions"
        value={creditsConsumed}
        Icon={CoinsIcon}
      />
    </div>
  );
};
const StatsSkeleton = () => {
  return (
    <div className="grid  gap-3 lg:grid-cols-3 lg:gap-9">
      {[1, 2, 3].map((i) => (
        <Skeleton className="w-full min-h-[120px]" key={i} />
      ))}
    </div>
  );
};
const StateExecutionStatus = async ({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) => {
  const data = await GetWorkExecutionStatus(selectedPeriod);
  return <ExecutionStatusChart data={data} />;
};
const CreditUsageInPeriod = async ({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) => {
  const data = await GetCreditUsageInPeriod(selectedPeriod);
  return (
    <ChartCreditPeriod
      data={data}
      title="Daily credit spend"
      description="Daily credit consumed in selected period"
    />
  );
};
export default Page;
