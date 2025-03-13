import { CardType, ColumnType } from "@/types/data.types";

export const capitalizeFirstLetter = (val: string) => {
  if (!val) return "";
  return `${val.charAt(0).toUpperCase() + val.slice(1)}`;
};
export const generatePlaceholderCard = (
  column: Pick<ColumnType, "boardId" | "_id">,
): CardType => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    title: "",
    description: "",
    cover: "",
    memberIds: [],
    comments: [],
    attachments: [],
    FE_placeholderCard: true,
  };
};
