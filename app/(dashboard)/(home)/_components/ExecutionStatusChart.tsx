"use client";
import { GetWorkExecutionStatus } from "@/actions/analytics/getWorkExecutionStatus";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Layers2 } from "lucide-react";
type ChartData = Awaited<ReturnType<typeof GetWorkExecutionStatus>>;

const configChart: ChartConfig = {
  success: {
    label: "Success",
    color: "hsl(var(--chart-2))",
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--chart-1))",
  },
};
const ExecutionStatusChart = ({ data }: { data: ChartData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex font-bold items-center gap-2">
          <Layers2 className="w-6 h-6 text-primary" />
          Workflow execution status
        </CardTitle>
        <CardDescription>
          Daily number of successfull and failed workflow executions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={configChart} className="max-h-[200px] w-full">
          <AreaChart
            data={data}
            accessibilityLayer
            height={200}
            margin={{
              top: 20,
            }}>
            <CartesianGrid vertical={false} />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);

                return date.toLocaleDateString("en-us", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <Area
              dataKey={"success"}
              min={0}
              type={"basis"}
              fillOpacity={0.6}
              fill="var(--color-success)"
              stroke="var(--color-success)"
              stackId={"a"}
            />
            <Area
              dataKey={"failed"}
              min={0}
              type={"basis"}
              fillOpacity={0.6}
              fill="var(--color-failed)"
              stroke="var(--color-failed)"
              stackId={"a"}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ExecutionStatusChart;
