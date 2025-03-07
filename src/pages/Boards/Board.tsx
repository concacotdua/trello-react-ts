import Column from "@/components/Column";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { BoardBarProps } from "./BoardBar/BoardBar";
import { mapOrder } from "@/utils/sort";
import { ColumnType } from "@/types/data.types";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  DndContext,
  UniqueIdentifier,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useState, useEffect } from "react";

export default function Board({ board }: BoardBarProps) {
  const [orderedColumns, setOrderedColumns] = useState<ColumnType[]>([]);
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const sensors = useSensors(pointerSensor);

  const id = board?.columns.map((c) => c._id) as unknown as UniqueIdentifier[];

  useEffect(() => {
    setOrderedColumns(
      mapOrder(
        board?.columns as unknown as ColumnType[],
        board?.columnOrderIds as string[],
        "_id",
      ),
    );
  }, [board]);

  const handleDragEnd = (event: any) => {
    console.log("handleDragEnd", event);
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);

      const newOrder = arrayMove(orderedColumns, oldIndex, newIndex);
      // const newOrderIds = newOrder.map((c) => c._id)
      setOrderedColumns(newOrder);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <SortableContext items={id} strategy={horizontalListSortingStrategy}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {orderedColumns.map((column) => (
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
      </SortableContext>
    </DndContext>
  );
}
