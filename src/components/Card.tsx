import { CardType } from "@/types/data.types";
import { MessageCircle, Paperclip, UsersRound } from "lucide-react";
import { FC } from "react";
import { Button } from "./ui/button";

interface CardProps extends CardType {
  label?: {
    color: string;
    text?: string;
  };
}

const Card: FC<CardProps> = ({
  title,
  cover,
  memberIds,
  comments,
  attachments,
  label,
}: CardProps) => {
  const shouldShowCard = () => {
    return !!memberIds.length || !!comments.length || !!attachments.length;
  };
  return (
    <div className="cursor-pointer rounded-md border border-border bg-popover p-3 shadow-sm transition-colors hover:bg-accent/50">
      {cover && (
        <div className="mb-2 h-32 w-full">
          <img
            src={cover}
            alt="avatar"
            className="h-full w-full rounded-lg object-cover"
          />
        </div>
      )}
      {label && (
        <div className="mb-2">
          <span
            className={`inline-block h-2 w-8 rounded-full ${
              label.color === "red"
                ? "bg-destructive"
                : label.color === "blue"
                  ? "bg-primary"
                  : label.color === "green"
                    ? "bg-chart-2"
                    : label.color === "yellow"
                      ? "bg-chart-4"
                      : "bg-muted"
            }`}
          />
        </div>
      )}

      <p className="text-sm font-medium text-foreground">{title}</p>

      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        {shouldShowCard() && (
          <>
            {!!memberIds.length && (
              <Button variant="ghost" size="icon">
                <UsersRound className="h-4 w-4" />
                {memberIds.length}
              </Button>
            )}

            {!!comments.length && (
              <div className="flex items-center rounded bg-muted/50 px-1.5 py-0.5">
                <MessageCircle className="mr-1 h-4 w-4" />
                {comments.length}
              </div>
            )}

            {!!attachments.length && (
              <div className="flex items-center rounded bg-muted/50 px-1.5 py-0.5">
                <Paperclip className="mr-1 h-4 w-4" />
                {attachments.length}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
