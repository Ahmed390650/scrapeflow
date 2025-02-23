"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
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
import { ChartColumnStackedIcon, Layers2 } from "lucide-react";
import { GetCreditUsageInPeriod } from "@/actions/analytics/getCreditUsageInPeriod";
type ChartData = Awaited<ReturnType<typeof GetCreditUsageInPeriod>>;

const configChart: ChartConfig = {
  success: {
    label: "Successfull Phases credit",
    color: "hsl(var(--chart-2))",
  },
  failed: {
    label: "Failed phases credit",
    color: "hsl(var(--chart-1))",
  },
};
const ChartCreditPeriod = ({
  data,
  title,
  description,
}: {
  data: ChartData;
  description: string;
  title: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex font-bold items-center gap-2">
          <ChartColumnStackedIcon className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={configChart} className="max-h-[200px] w-full">
          <BarChart
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
            <Bar
              dataKey={"success"}
              radius={[0, 0, 4, 4]}
              fillOpacity={0.6}
              fill="var(--color-success)"
              stroke="var(--color-success)"
              stackId={"a"}
            />
            <Bar
              dataKey={"failed"}
              radius={[4, 4, 0, 0]}
              fillOpacity={0.6}
              fill="var(--color-failed)"
              stroke="var(--color-failed)"
              stackId={"a"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartCreditPeriod;
