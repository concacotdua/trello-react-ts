import Header from '@/components/Header'
import BoardBar from './BoardBar'
import Board from './Board'
import { mockData } from '@/apis/mock-data'
import { BoardType } from '@/types/data.types'

export default function Boards() {
  const board = mockData.board as unknown as BoardType

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
