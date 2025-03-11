import { FC } from "react";
import Card from "./Card";
import { MoreHorizontal, Plus } from "lucide-react";
import { ColumnType } from "@/types/data.types";
import { mapOrder } from "@/utils/sort";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const Column: FC<ColumnType> = ({ ...column }: ColumnType) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column._id, data: { ...column } });

  const dndKitColumnStyle = {
    touchAction: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    height: "100%",
  };

  const orderCards = mapOrder(column.cards, column.cardOrderIds, "_id");

  return (
    <div
      ref={setNodeRef}
      style={dndKitColumnStyle}
      {...listeners}
      {...attributes}
      className={cn(
        "flex h-full max-h-[calc(100vh-10rem)] w-[280px] shrink-0 flex-col rounded-lg border bg-card/95 p-2 md:w-72 md:p-3",
        isDragging && "opacity-50",
      )}
    >
      <div className="flex items-center justify-between pb-2 md:pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            {column.title}
          </h3>
          <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground md:px-2">
            {column.cards.length}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground opacity-80 group-hover:opacity-100 md:h-8 md:w-8"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Add card...</DropdownMenuItem>
            <DropdownMenuItem>Copy list...</DropdownMenuItem>
            <DropdownMenuItem>Move list...</DropdownMenuItem>
            <DropdownMenuItem>Watch</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Archive this list
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto overflow-x-hidden">
        <div className="space-y-4 pb-2">
          <SortableContext
            items={orderCards.map((c) => c._id)}
            strategy={verticalListSortingStrategy}
          >
            {orderCards.map((card) => (
              <div key={card._id}>
                <Card {...card} />
              </div>
            ))}
          </SortableContext>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="mt-2 w-full justify-start text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add a card
      </Button>
    </div>
  );
};

export default Column;
