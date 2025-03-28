import Header from '@/components/Header'
import BoardBar from './BoardBar'
import Board from './Board'
import { BoardType, CardType, ColumnType } from '@/types/data.types'
import { useEffect, useState } from 'react'
import { boardApi } from '@/apis/boardApi'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '@/utils/formattext'
import { mapOrder } from '@/utils/sort'
import { UniqueIdentifier } from '@dnd-kit/core'

export default function Boards() {
  const [board, setBoard] = useState<BoardType | null>(null)
  useEffect(() => {
    const boardId = '67e4d38a3cb8ec59829c233a'
    boardApi.getBoardDetail(boardId).then((board: BoardType) => {
      board.columns = mapOrder(board.columns as ColumnType[], board.columnOrderIds, '_id')

      board.columns?.forEach((column: ColumnType) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          column.cards = mapOrder(column.cards as CardType[], column.cardOrderIds, '_id')
        }
      })
      console.log('full board', board)

      setBoard(board)
    })
  }, [])

  const createNewColumn = async (newColumnData: ColumnType) => {
    const createdColumn = await boardApi.createNewColumn({
      ...newColumnData,
      boardId: board?._id as string
    })

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    const newBoard = { ...board } as BoardType
    newBoard.columns?.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  const createNewCard = async (newCardData: CardType) => {
    const createdCard = await boardApi.createNewCard({
      ...newCardData,
      boardId: board?._id as string
    })
    const newBoard = { ...board } as BoardType
    const columnToUpdate = newBoard.columns?.find((column) => column._id === createdCard.columnId)
    if (columnToUpdate) {
      if (columnToUpdate.cards.some((card) => card.FE_placeholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }

    setBoard(newBoard)
  }

  const moveColumns = (dndOrderedColumns: ColumnType[]) => {
    const dndOrderedColumnIds = dndOrderedColumns.map((column) => column._id)
    const newBoard = { ...board } as BoardType
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    setBoard(newBoard)

    boardApi.updateBoardDetail(newBoard?._id as string, { columnOrderIds: dndOrderedColumnIds })
    return newBoard
  }

  const moveCardsInTheSameColumn = (dndOrderedCards: CardType[], dndOrderedCardIds: string[], ColumnId: string) => {
    const newBoard = { ...board } as BoardType
    const columnToUpdate = newBoard.columns?.find((column) => column._id === ColumnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    boardApi.updateColumnDetail(ColumnId, { cards: dndOrderedCards, cardOrderIds: dndOrderedCardIds })
  }

  const moveCardToDifferentColumn = (currentCardId: UniqueIdentifier, prevColumnId: string, nextColumnId: string, dndOrderedColumns: ColumnType[]) => {
    const dndOrderedColumnIds = dndOrderedColumns.map((column) => column._id)
    const newBoard = { ...board } as BoardType
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    setTimeout(() => setBoard(newBoard), 0)

    let prevCardOrderIds = dndOrderedColumns.find((column) => column._id === prevColumnId)?.cardOrderIds
    console.log('prevCardOrderIds', prevCardOrderIds)

    if (prevCardOrderIds?.[0].includes('placeholder-card')) prevCardOrderIds = []
    boardApi.moveCardTodifferentColumnApi({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((column) => column._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board)
    return (
      <div className='flex h-screen items-center justify-center transition-all duration-300 ease-in-out hover:scale-105 hover:rotate-90'>
        <svg role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' className='backdrop-brightness-90 fill-[#5FCF80]'>
          <title>Triller</title>
          <path d='M15.548 5.216L7.005 20.012l-.29-.167 8.54-14.788a9.365 9.365 0 0 0-6.07-.906L2.73 15.333l-.609 1.055a9.34 9.34 0 0 0 3.818 4.806l-1.522 2.64.289.166 2.303-3.987h-.002a9.367 9.367 0 0 0 6.068.905l6.321-10.945.287.167-6.168 10.683-.964 1.67a9.322 9.322 0 0 0 7.55-7.555 9.267 9.267 0 0 0-.413-4.802l2.299-3.982-.29-.167L20.14 8.68a9.343 9.343 0 0 0-3.816-4.806zm-5.842-2.64a9.324 9.324 0 0 0-7.132 12.359L8.893 3.989l.292.162L11.483.167 11.193 0z' />
        </svg>
      </div>
    )
  return (
    <div className='flex-shink h-screen overflow-x-auto'>
      <div className='min-h-screen bg-background'>
        <Header />
        <div className='p-6'>
          <BoardBar board={board} />
          <Board
            board={board}
            createNewColumn={createNewColumn}
            createNewCard={createNewCard}
            moveColumns={moveColumns}
            moveCardsInTheSameColumn={moveCardsInTheSameColumn}
            moveCardToDifferentColumn={moveCardToDifferentColumn}
          />
        </div>
      </div>
    </div>
  )
}
