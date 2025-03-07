import Column from "@/components/Column";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { BoardBarProps } from "./BoardBar/BoardBar";
import { mapOrder } from "@/utils/sort";
import { ColumnType } from "@/types/data.types";

export default function Board({ board }: BoardBarProps) {
  const orderColumns = mapOrder(
    board?.columns as unknown as ColumnType[],
    board?.columnOrderIds as string[],
    "_id",
  );
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {orderColumns.map((column) => (
        <Column {...column} key={column._id} />
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
