import { MessageCircle } from "lucide-react";
import { FC } from "react";

interface CardProps {
  title: string;
  label?: {
    color: string;
    text?: string;
  };
  commentCount?: number;
}

const Card: FC<CardProps> = ({ title, label, commentCount }) => {
  const _isVisible = false;

  return (
    <div className="cursor-pointer rounded-md border border-border bg-popover p-3 shadow-sm transition-colors hover:bg-accent/50">
      {_isVisible && (
        <div className="h-32 w-full">
          <img
            src="https://i.pinimg.com/236x/d4/96/76/d496761128b05abc4aed6a81985c873a.jpg"
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

      {commentCount !== undefined && commentCount > 0 && (
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <div className="flex items-center rounded bg-muted/50 px-1.5 py-0.5">
            <MessageCircle className="mr-1 h-4 w-4" />
            {commentCount}
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
