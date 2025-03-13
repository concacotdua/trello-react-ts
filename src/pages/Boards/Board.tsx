<<<<<<< HEAD
import { useState, useEffect, useCallback } from "react";
=======
import { useState, useEffect, useMemo } from "react";

>>>>>>> faab014c075f0202a4a104a13b9250971f043870
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
<<<<<<< HEAD
=======
const [activeDragItemId, setActiveDragItemId] =
    useState<UniqueIdentifier | null>(null);
  const [activeDragItemType, setActiveDragItemType] = useState<string | null>(
    null,
  );
  const [activeDragItemData, setActiveDragItemData] = useState<
    CardType | ColumnType | null
  >(null);
  const [oldColumnDragCard, setOldColumnDragCard] = useState<ColumnType | null>(
    null,
  );
>>>>>>> faab014c075f0202a4a104a13b9250971f043870

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

  useEffect(() => {
    if (!board?.columns) return;
    const ordered = mapOrder(
      board?.columns as ColumnType[],
      board?.columnOrderIds || [],
      "_id",
    );
    console.log("🔍 orderedColumns:", ordered);
    setOrderedColumns(ordered);
  }, [board]);

<<<<<<< HEAD
  const findColumnByCardId = (cardId: string) => {
    const foundColumn = orderedColumns.find((c) =>
      c.cards.map((card) => card._id).includes(cardId),
    );
    return foundColumn;
=======
const findColumnByCardId = (cardId: string): ColumnType | null => {
    return (
      orderedColumns.find((c) => c.cards.some((card) => card._id === cardId)) ||
      null
    );
>>>>>>> faab014c075f0202a4a104a13b9250971f043870
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragItemId(event.active.id);
    const isCard = !!event.active.data.current?.columnId;
    setActiveDragItemType(
      isCard ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN,
    );
<<<<<<< HEAD
    setActiveDragItemData(event.active.data.current || null);
=======
setActiveDragItemData(event.active.data.current as CardType | ColumnType);
    if (isCard) {
      const oldColumn = findColumnByCardId(event.active.id as string);
      setOldColumnDragCard(oldColumn || null);
    }
>>>>>>> faab014c075f0202a4a104a13b9250971f043870
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
<<<<<<< HEAD
    console.log("activeColumn", activeColumn);
=======
console.log("activeColumn", activeColumn);
>>>>>>> faab014c075f0202a4a104a13b9250971f043870
    console.log("overColumn", overColumn);

    if (!activeColumn || !overColumn) return;

    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prevColumns) => {
        const overCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId,
        );
<<<<<<< HEAD
=======

>>>>>>> faab014c075f0202a4a104a13b9250971f043870
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
<<<<<<< HEAD
        if (nextOverColumn) {
          nextOverColumn.cards = nextOverColumn.cards.filter(
            (c) => c._id !== activeDraggingCardId,
          );
=======

        if (nextOverColumn) {
          nextOverColumn.cards = nextOverColumn.cards.filter(
            (card) => card._id !== activeDraggingCardId,
          );
          console.log("🛠 Trước khi thêm card:", nextOverColumn.cards.length);

>>>>>>> faab014c075f0202a4a104a13b9250971f043870
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(
            newCardIndex,
            0,
            activeDraggingCardData as CardType,
          );
<<<<<<< HEAD
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map((c) => c._id);
=======
console.log("🛠 Sau khi thêm card:", nextOverColumn.cards.length);
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
            (card) => card._id,
          );
        }
        if (!nextOverColumn) {
          console.warn("⚠️ Không tìm thấy nextOverColumn, bỏ qua cập nhật!");
          return prevColumns;
>>>>>>> faab014c075f0202a4a104a13b9250971f043870
        }
        return nextColumns;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
<<<<<<< HEAD
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
=======
const { active, over } = event;
    console.log("🔍 handleDragEnd - Active:", active);
    console.log("🔍 handleDragEnd - Over:", over);

    if (!over || !active) {
      console.warn("⚠️ Active hoặc Over không tồn tại:", { active, over });
      // Reset state ngay cả khi không hợp lệ
      setActiveDragItemId(null);
      setActiveDragItemType(null);
      setActiveDragItemData(null);
      setOldColumnDragCard(null);
      return;
    }
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active;
      const { id: overCardId } = over;

      console.log("🔍 activeDraggingCardData:", activeDraggingCardData);

      const activeColumn =
        findColumnByCardId(activeDraggingCardId as string) || oldColumnDragCard;
      const overColumn = findColumnByCardId(overCardId as string);

      if (!activeColumn || !overColumn) {
        console.warn("⚠️ Không tìm thấy activeColumn hoặc overColumn:", {
          activeColumn,
          overColumn,
        });
        return;
      }
      if (oldColumnDragCard?._id !== overColumn._id) {
        setOrderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns);
          const overCardIndex = overColumn?.cards?.findIndex(
            (card) => card._id === overCardId,
          );

          let newCardIndex;
          const isBelowOverItem =
            active.rect.current.translated &&
            active.rect.current.translated.top >
              over.rect.top + over.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;

          newCardIndex =
            overCardIndex >= 0
              ? overCardIndex + modifier
              : overColumn?.cards?.length + 1;

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
              (card) => card._id !== activeDraggingCardId,
            );
            console.log("🛠 Trước khi thêm card:", nextOverColumn.cards.length);
            if (!activeDraggingCardData) {
              console.error("⚠️ activeDraggingCardData là undefined!");
              return prevColumns; // Thoát sớm nếu dữ liệu không hợp lệ
            }
            nextOverColumn.cards = nextOverColumn.cards.toSpliced(
              newCardIndex,
              0,
              activeDraggingCardData as CardType,
            );
            console.log("🛠 Sau khi thêm card:", nextOverColumn.cards.length);
            nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
              (card) => card._id,
            );
          }

          return nextColumns;
        });
      } else {
        const oldCardIndex = oldColumnDragCard.cards.findIndex(
          (c) => c._id === activeDragItemId,
        );
        const newCardIndex = overColumn.cards.findIndex(
          (c) => c._id === overCardId,
        );
        const newOrderCard = arrayMove(
          oldColumnDragCard.cards,
          oldCardIndex,
          newCardIndex,
        );

        setOrderedColumns((prev) => {
          const nextColumns = cloneDeep(prev);
          const targetColumn = nextColumns.find(
            (c) => c._id === overColumn._id,
          );
          if (targetColumn) {
            targetColumn.cards = newOrderCard;
            targetColumn.cardOrderIds = newOrderCard.map((card) => card._id);
          }
          return nextColumns;
        });
      }
    }
    // If there's no valid drop target, reset the state and return

    // Handle column reordering
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      console.log("kéo column, card không làm gì cả");

      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex(
          (c) => c._id === active.id,
        );
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id,
        );

        const newOrderColumn = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex,
        );
        setOrderedColumns(newOrderColumn);
      }
    }
    // Reset drag state
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnDragCard(null);
>>>>>>> faab014c075f0202a4a104a13b9250971f043870
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
      <SortableContext
        items={orderedColumns.map((c) => c._id) as UniqueIdentifier[]}
        strategy={horizontalListSortingStrategy}
      >
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
<<<<<<< HEAD
            <Card
              key={(activeDragItemData as CardType)._id}
              {...(activeDragItemData as CardType)}
            />
=======
 <div>
              <Card
                key={String((activeDragItemData as CardType)._id)}
                {...(activeDragItemData as CardType)}
              />
            </div>
>>>>>>> faab014c075f0202a4a104a13b9250971f043870
          )}
      </DragOverlay>
    </DndContext>
  );
}
