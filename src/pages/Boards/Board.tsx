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
  MouseSensor,
  TouchSensor,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { useState, useEffect, useCallback } from "react";
import { ACTIVE_DRAG_ITEM_TYPE } from "@/constants/active";
export default function Board({ board }: BoardBarProps) {
  const [orderedColumns, setOrderedColumns] = useState<ColumnType[]>([]);
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: {
  //     distance: 5,
  //   },
  // });
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 500,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const id = board?.columns.map((c) => c._id) as UniqueIdentifier[];

  const [activeDragItemId, setActiveDragItemId] =
    useState<UniqueIdentifier | null>(null);
  const [activeDragItemType, setActiveDragItemType] = useState<string | null>(
    null,
  );
  const [activeDragItemData, setActiveDragItemData] = useState<{} | null>(null);

  useEffect(() => {
    if (!board?.columns) return;
    setOrderedColumns(
      mapOrder(
        board?.columns as unknown as ColumnType[],
        board?.columnOrderIds || [],
        "_id",
      ),
    );
  }, [board?.columns, board?.columnOrderIds]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    console.log("start", event);
    console.log("columnId", event.active.data.current?.columnId);

    setActiveDragItemId(event.active.id);
    setActiveDragItemType(
      event.active.data.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN,
    );
    setActiveDragItemData(event.active.data.current || null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      console.log("end", event);

      const { active, over } = event;
      if (!over) return;
      if (active.id !== over.id) {
        const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
        const newIndex = orderedColumns.findIndex((c) => c._id === over.id);

        const newOrder = arrayMove(orderedColumns, oldIndex, newIndex);
        // const newOrderIds = newOrder.map((c) => c._id)
        setOrderedColumns(newOrder);
      }
      setActiveDragItemId(null);
      setActiveDragItemType(null);
      setActiveDragItemData(null);
    },
    [orderedColumns],
  );

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
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
      <DragOverlay>
        {!activeDragItemType && null}
        {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN &&
          activeDragItemData && (
            <Column {...(activeDragItemData as ColumnType)} />
          )}
      </DragOverlay>
    </DndContext>
  );
}
