import { CardType } from "@/types/data.types";
import { MessageCircle, Paperclip, GripVertical } from "lucide-react";
import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Card: FC<CardType> = ({
  _id,
  attachments,
  columnId,
  comments,
  boardId,
  cover,
  memberIds,
  title,
}: CardType) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: _id,
    data: { _id, attachments, columnId, comments, cover, memberIds, title },
  });

  const dndCardStyle = {
    touchAction: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: isDragging ? "1px solid #63f267" : undefined,
  };

  const shouldShowCard = () => {
    return !!memberIds.length || !!comments.length || !!attachments.length;
  };

  return (
    <div
      className={cn(
        "group relative rounded-md border bg-card p-2 md:p-3",
        "shadow-sm",
      )}
      ref={setNodeRef}
      style={dndCardStyle}
      {...attributes}
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        className="absolute right-0 top-1/2 flex h-10 w-6 -translate-y-1/2 cursor-grab items-center justify-center opacity-0 group-hover:opacity-100"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {cover && (
        <div className="mb-2 h-24 w-full overflow-hidden rounded-md md:h-32">
          <img
            src={cover}
            alt="cover"
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
      )}

      <p className="line-clamp-3 text-sm font-medium text-foreground">
        {title}
      </p>

      {shouldShowCard() && (
        <div className="mt-2 flex items-center justify-between md:mt-3">
          <div className="flex -space-x-1.5 md:-space-x-2">
            <TooltipProvider>
              {memberIds.map((member, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Avatar
                      className="h-5 w-5 select-none border-2 border-background md:h-6 md:w-6"
                      draggable={false}
                    >
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${member}`}
                        draggable={false}
                      />
                      <AvatarFallback className="text-[10px] md:text-xs">
                        {member.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{member}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground md:text-xs">
            {!!comments.length && (
              <div className="flex select-none items-center rounded bg-muted px-1.5 py-0.5">
                <MessageCircle className="mr-1 h-3 w-3 md:h-3.5 md:w-3.5" />
                {comments.length}
              </div>
            )}
            {!!attachments.length && (
              <div className="flex select-none items-center rounded bg-muted px-1.5 py-0.5">
                <Paperclip className="mr-1 h-3 w-3 md:h-3.5 md:w-3.5" />
                {attachments.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
