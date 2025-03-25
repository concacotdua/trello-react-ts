import Header from '@/components/Header'
import BoardBar from './BoardBar'
import Board from './Board'
import { mockData } from '@/apis/mock-data'
import { BoardType } from '@/types/data.types'
import { useEffect, useState } from 'react'
import { boardApi } from '@/apis/boardApi'

export default function Boards() {
  const board = mockData.board as BoardType
  // const [board, setBoard] = useState<BoardType>()
  // const boardId = '67e22e2788131d0fadb1f772'

  // useEffect(() => {
  //   if (boardId) {
  //     boardApi.getBoardDetail(boardId).then((res) => {
  //       console.log('data', res.data)
  //       setBoard(res.data)
  //     })
  //   }
  // }, [boardId])

  return (
    <div className='flex-shink h-screen overflow-x-auto'>
      <div className='min-h-screen bg-background'>
        <Header />
        <div className='p-6'>
          <BoardBar board={board} />
          <Board board={board} />
        </div>
      </div>
    </div>
  )
}
