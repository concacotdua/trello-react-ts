import Column from "@/components/Column";
import { Button } from "@/components/ui/button";
import { SAMPLE_DATA } from "@/constants/data";
import { PlusCircleIcon } from "lucide-react";

export default function Board() {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {SAMPLE_DATA.columns.map((column, index) => (
        <Column key={index} {...column} />
      ))}
      <div className="flex-col">
        <Button
          variant="outline"
          className="bg-slate-500/50 hover:bg-slate-700/50"
        >
          <PlusCircleIcon className="h-4 w-4" />
          Add new column
        </Button>
      </div>
    </div>
  );
}
