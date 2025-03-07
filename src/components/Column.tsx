import { FC } from "react";
import Card from "./Card";
import { PackagePlus } from "lucide-react";
import { ColumnType } from "@/types/data.types";
import { mapOrder } from "@/utils/sort";

const Column: FC<ColumnType> = ({
  title,
  cards,
  cardOrderIds,
  _id,
}: ColumnType) => {
  const orderCards = mapOrder(cards, cardOrderIds, "_id");
  return (
    <div className="w-72 shrink-0 overflow-y-auto rounded-lg border border-border bg-card p-3 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-card-foreground">{title}</h3>
          <span className="text-sm text-muted-foreground">
            ({cards.length})
          </span>
        </div>
        <button className="text-muted-foreground hover:text-card-foreground">
          <span className="sr-only">More options</span>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      <div className="space-y-2">
        {cards.map((card) => (
          <Card {...card} key={card.id} />
        ))}
      </div>

      <button className="mt-2 flex w-full items-center gap-2 rounded px-2 py-2 text-left text-muted-foreground hover:bg-accent/50 hover:text-card-foreground">
        <PackagePlus className="h-5 w-5" />
        Add a card
      </button>
    </div>
  );
};

export default Column;
