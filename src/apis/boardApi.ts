import { BoardType, CardType, ColumnType } from '@/types/data.types'
import http from '@/utils/http'
import { UniqueIdentifier } from '@dnd-kit/core'

export const boardApi = {
  getBoards: async () => {
    return await http.get('/v1/boards')
  },
  getBoardDetail: async (boardId: string) => {
    const response = await http.get(`/v1/boards/${boardId}`)
    return response.data
  },
  updateBoardDetail: async (boardId: string, updateData: Partial<BoardType>) => {
    const response = await http.put(`/v1/boards/${boardId}`, updateData)
    return response.data
  },
  moveCardTodifferentColumnApi: async (updateData: {
    currentCardId: string | UniqueIdentifier
    prevColumnId: string
    prevCardOrderIds?: string[]
    nextColumnId: string
    nextCardOrderIds?: string[]
  }) => {
    const response = await http.put(`/v1/boards/supports/moving_cards`, updateData)
    return response.data
  },

  createNewColumn: async (newColumnData: ColumnType) => {
    const respone = await http.post('/v1/columns', newColumnData)
    return respone.data as ColumnType
  },
  updateColumnDetail: async (columnId: string, updateData: Partial<ColumnType>) => {
    const response = await http.put(`/v1/columns/${columnId}`, updateData)
    return response.data
  },
  createNewCard: async (newCardData: CardType) => {
    const respone = await http.post('/v1/cards', newCardData)
    return respone.data as CardType
  }
}
