import http from '@/utils/http'

export const boardApi = {
  getBoardDetail: async (boardId: string) => {
    return await http.get(`/v1/boards/${boardId}`)
  },
  getBoards: async () => {
    return await http.get('/v1/boards')
  }
}
