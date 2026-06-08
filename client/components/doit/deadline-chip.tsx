import { Clock, Flag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { diffDays, parseIso, relShort, TODAY } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface DeadlineChipProps {
  deadline: string;
  done: boolean;
  className?: string;
}

export function DeadlineChip({ deadline, done, className }: DeadlineChipProps) {
  const dl = parseIso(deadline);
  const n = diffDays(dl, TODAY);
  const overdue = !done && n < 0;
  const soon = !done && (n === 0 || n === 1);
  const variant = overdue ? "overdue" : soon ? "soon" : "default";

  return (
    <Badge
      variant={variant}
      className={cn(soon && "bg-[rgba(224,144,26,0.12)]", done && "opacity-50", className)}
    >
      {overdue ? <Clock className="h-3 w-3" /> : <Flag className="h-[11px] w-[11px]" />}
      {overdue ? `Atrasada · ${relShort(dl)}` : relShort(dl)}
    </Badge>
  );
}
