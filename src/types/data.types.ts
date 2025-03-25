export type ColumnType = {
  _id: string
  boardId: string
  title: string
  cardOrderIds: string[]
  cards: CardType[]
}

export type CardType = {
  _id: string
  boardId: string
  columnId: string
  title: string
  description: string
  cover: string
  memberIds: string[]
  comments: string[]
  attachments: string[]
  FE_placeholderCard?: boolean
}

export type BoardType = {
  _id: string
  title: string
  description: string
  type: string
  ownerIds?: never[]
  memberIds?: never[]
  columnOrderIds: string[]
  columns?: ColumnType[]
  cards?: CardType[]
}
