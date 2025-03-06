import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Clipboard, Copy, Scissors } from "lucide-react";

export default function WorkSpace() {
  return (
    <DropdownMenu>
      <Button
        variant="ghost"
        className="border-none text-sm hover:border-transparent hover:bg-transparent md:text-xl"
      >
        <DropdownMenuTrigger asChild>
          <span className="flex items-center text-black dark:text-white">
            WorkSpace
            <ChevronDown className="ml-2 h-4 w-4" />
          </span>
        </DropdownMenuTrigger>
      </Button>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Keyboard Shortcuts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          Ctrl + C
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Clipboard className="mr-2 h-4 w-4" />
          Ctrl + V
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Scissors className="mr-2 h-4 w-4" />
          Ctrl + X
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
