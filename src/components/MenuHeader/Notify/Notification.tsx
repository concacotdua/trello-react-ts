import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
export default function Notification() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="destructive"
            className="rounded-full text-sm md:text-xl"
          >
            <Bell className="h-6 w-6 text-white" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Notification</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
