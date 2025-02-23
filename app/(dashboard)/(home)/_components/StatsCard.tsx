import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactCountUpWrapper from "@/components/ReactCountWrapper";
interface props {
  title: string;
  value: number;
  Icon: LucideIcon;
}
const StatsCard = ({ Icon, title, value }: props) => {
  return (
    <Card className="w-full overflow-hidden relative">
      <CardHeader className="flex pb-2">
        <CardTitle>{title}</CardTitle>
        <Icon
          size={120}
          className="absolute -bottom-4 -right-8 opacity-10 text-muted-foreground stroke-primary"
        />
      </CardHeader>
      <CardContent>
        <div>
          <ReactCountUpWrapper value={value} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
