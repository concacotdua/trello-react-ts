import { useState, useEffect, useCallback } from "react";
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
  defaultDropAnimationSideEffects,
  DropAnimation,
  DragOverEvent,
  closestCorners,
} from "@dnd-kit/core";
import { PlusCircleIcon } from "lucide-react";

import Column from "@/components/Column";
import { Button } from "@/components/ui/button";
import { BoardBarProps } from "./BoardBar/BoardBar";
import { mapOrder } from "@/utils/sort";
import { CardType, ColumnType } from "@/types/data.types";
import { ACTIVE_DRAG_ITEM_TYPE } from "@/constants/active";
import Card from "@/components/Card";
import { cloneDeep } from "lodash";

export default function Board({ board }: BoardBarProps) {
  const [orderedColumns, setOrderedColumns] = useState<ColumnType[]>([]);

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

  const findColumnByCardId = (cardId: string) => {
    const foundColumn = orderedColumns.find((c) =>
      c.cards.map((card) => card._id).includes(cardId),
    );
    return foundColumn;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragItemId(event.active.id);
    setActiveDragItemType(
      event.active.data.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN,
    );
    setActiveDragItemData(event.active.data.current || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;
    const { active, over } = event;
    if (!active || !over) return;
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;

    const { id: overCardId } = over;
    const activeColumn = findColumnByCardId(activeDraggingCardId as string);
    const overColumn = findColumnByCardId(overCardId as string);
    console.log("activeColumn", activeColumn);
    console.log("overColumn", overColumn);

    if (!activeColumn || !overColumn) return;

    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prevColumns) => {
        const overCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId,
        );
        let newCardIndex;
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;

        newCardIndex =
          overCardIndex >= 0
            ? overCardIndex + modifier
            : overColumn?.cards?.length + 1;

        const nextColumns = cloneDeep(prevColumns);
        const nextActiveColumn = nextColumns.find(
          (c) => c._id === activeColumn._id,
        );
        const nextOverColumn = nextColumns.find(
          (c) => c._id === overColumn._id,
        );

        if (nextActiveColumn) {
          nextActiveColumn.cards = nextActiveColumn.cards.filter(
            (c) => c._id !== activeDraggingCardId,
          );
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
            (c) => c._id,
          );
        }
        if (nextOverColumn) {
          nextOverColumn.cards = nextOverColumn.cards.filter(
            (c) => c._id !== activeDraggingCardId,
          );
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(
            newCardIndex,
            0,
            activeDraggingCardData as CardType,
          );
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map((c) => c._id);
        }
        return nextColumns;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      return;
    }
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
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={id} strategy={horizontalListSortingStrategy}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {orderedColumns.map((column, index) => (
            <Column {...column} key={index} />
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
      <DragOverlay dropAnimation={dropAnimation}>
        {!activeDragItemType && null}
        {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN &&
          activeDragItemData && (
            <Column {...(activeDragItemData as ColumnType)} />
          )}
        {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD &&
          activeDragItemData && (
            <Card
              key={(activeDragItemData as CardType)._id}
              {...(activeDragItemData as CardType)}
            />
          )}
      </DragOverlay>
    </DndContext>
  );
}
