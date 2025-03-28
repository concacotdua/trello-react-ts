import { useState, useEffect, useCallback, useRef } from 'react'
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import {
  DndContext,
  UniqueIdentifier,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
  DragOverEvent,
  closestCorners,
  pointerWithin,
  getFirstCollision,
  CollisionDetection,
  Active,
  Over
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '@/customs/DndKitSensors'
import { PlusCircleIcon, X } from 'lucide-react'

import Column from '@/components/Column'
import { Button } from '@/components/ui/button'
import { BoardBarProps } from './BoardBar/BoardBar'
import { CardType, ColumnType } from '@/types/data.types'
import { ACTIVE_DRAG_ITEM_TYPE } from '@/constants/active'
import Card from '@/components/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '@/utils/formattext'
import { Input } from '@/components/ui/input'
import { toast } from 'react-toastify'

export default function Board({ board, createNewColumn = () => {}, createNewCard, moveColumns = () => {}, moveCardsInTheSameColumn = () => {}, moveCardToDifferentColumn = () => {} }: BoardBarProps) {
  const [orderedColumns, setOrderedColumns] = useState<ColumnType[]>([])
  const [activeDragItemId, setActiveDragItemId] = useState<UniqueIdentifier | null>(null)
  const [activeDragItemType, setActiveDragItemType] = useState<string | null>(null)
  const [activeDragItemData, setActiveDragItemData] = useState<CardType | ColumnType | null>(null)
  const [oldColumnDragCard, setOldColumnDragCard] = useState<ColumnType | null>(null)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const addNewColumnData = () => {
    if (!newColumnTitle) {
      toast.error('Hãy nhập title cho cột mới!!')
      return
    }
    const newColumnData = {
      title: newColumnTitle
    } as ColumnType

    createNewColumn(newColumnData)

    toggleNewColumnForm()
    setNewColumnTitle('')
  }

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10
    }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 500
    }
  })
  const sensors = useSensors(mouseSensor, touchSensor)
  const lastOverId = useRef<UniqueIdentifier | null>(null)

  useEffect(() => {
    console.log('🔍 board.columns:', board?.columns)
    setOrderedColumns(board?.columns as ColumnType[])
  }, [board])

  const findColumnByCardId = (cardId: string): ColumnType | null => {
    return orderedColumns.find((c) => c.cards.some((card) => card._id === cardId)) || null
  }
  const resetDragState = () => {
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnDragCard(null)
  }

  const moveCardBetweenColumns = (
    prevColumns: ColumnType[],
    active: Active,
    over: Over,
    activeColumn: ColumnType,
    overColumn: ColumnType,
    activeDraggingCardId: UniqueIdentifier,
    activeDraggingCardData: any,
    triggerForm: string
  ): ColumnType[] => {
    const nextColumns = cloneDeep(prevColumns)

    // Tính toán vị trí mới của card trong column đích
    const overCardIndex = overColumn.cards.findIndex((card) => card._id === over.id)
    const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
    const modifier = isBelowOverItem ? 1 : 0
    const newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn.cards.length + 1

    // Tìm column nguồn và đích trong mảng nextColumns
    const nextActiveColumn = nextColumns.find((c) => c._id === activeColumn._id)
    const nextOverColumn = nextColumns.find((c) => c._id === overColumn._id)

    if (nextActiveColumn) {
      // Xóa card khỏi column nguồn
      nextActiveColumn.cards = nextActiveColumn.cards.filter((c) => c._id !== activeDraggingCardId)
      // Thêm placeholder nếu column rỗng
      if (isEmpty(nextActiveColumn.cards)) {
        nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
      }

      nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((c) => c._id)
    }

    if (nextOverColumn) {
      // Xóa card trùng nếu có (tránh trùng lặp)
      nextOverColumn.cards = nextOverColumn.cards.filter((card) => card._id !== activeDraggingCardId)

      // Kiểm tra dữ liệu card
      if (!activeDraggingCardData) {
        console.warn('⚠️ activeDraggingCardData không hợp lệ')
        return prevColumns // Thoát sớm nếu dữ liệu không hợp lệ
      }
      // Thêm card vào column đích
      nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData as CardType)
      // Loại bỏ placeholder card
      nextOverColumn.cards = nextOverColumn.cards.filter((card) => !card.FE_placeholderCard)

      nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card._id)
    }

    if (triggerForm === 'handleDragEnd') {
      moveCardToDifferentColumn(activeDraggingCardId, oldColumnDragCard?._id as string, nextOverColumn?._id as string, nextColumns)
    }
    return nextColumns
  }
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragItemId(event.active.id)
    const isCard = !!event.active.data.current?.columnId
    setActiveDragItemType(isCard ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event.active.data.current as CardType | ColumnType)
    if (isCard) {
      const oldColumn = findColumnByCardId(event.active.id as string)
      setOldColumnDragCard(oldColumn || null)
    }
  }
  const handleDragOver = (event: DragOverEvent) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    const { active, over } = event
    if (!active || !over) return
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active

    const { id: overCardId } = over
    const activeColumn = findColumnByCardId(activeDraggingCardId as string)
    const overColumn = findColumnByCardId(overCardId as string)

    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prevColumns) => moveCardBetweenColumns(prevColumns, active, over, activeColumn, overColumn, activeDraggingCardId, activeDraggingCardData, 'handleDragOver'))
    }
  }
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    console.log('🔍 handleDragEnd - Active:', active)
    console.log('🔍 handleDragEnd - Over:', over)

    if (!over || !active) {
      console.warn('⚠️ Active hoặc Over không tồn tại:', { active, over })
      resetDragState()
      return
    }
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId as string) || oldColumnDragCard
      const overColumn = findColumnByCardId(overCardId as string)

      if (!activeColumn || !overColumn) {
        console.warn('⚠️ Không tìm thấy activeColumn hoặc overColumn:', {
          activeColumn,
          overColumn
        })
        return
      }
      if (oldColumnDragCard?._id !== overColumn._id) {
        setOrderedColumns((prevColumns) => moveCardBetweenColumns(prevColumns, active, over, activeColumn, overColumn, activeDraggingCardId, activeDraggingCardData, 'handleDragEnd'))
      } else {
        const oldCardIndex = oldColumnDragCard.cards.findIndex((c) => c._id === activeDragItemId)
        const newCardIndex = overColumn.cards.findIndex((c) => c._id === overCardId)
        const dndOrderedCards = arrayMove(oldColumnDragCard.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds = dndOrderedCards.map((card) => card._id)

        setOrderedColumns((prev) => {
          const nextColumns = cloneDeep(prev)
          const targetColumn = nextColumns.find((c) => c._id === overColumn._id)
          if (targetColumn) {
            targetColumn.cards = dndOrderedCards
            targetColumn.cardOrderIds = dndOrderedCardIds
          }
          return nextColumns
        })
        moveCardsInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumnDragCard._id)
      }
    }
    // If there's no valid drop target, reset the state and return

    // Handle column reordering
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex((c) => c._id === active.id)
        const newColumnIndex = orderedColumns.findIndex((c) => c._id === over.id)

        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        moveColumns(dndOrderedColumns)
        setOrderedColumns(dndOrderedColumns)
      }
    }
    // Reset drag state
    resetDragState()
  }

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  // fix bug khi giữ lại ở giữa card và column closestCorners or closestCenter
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners(args)
      }
      const pointerIntersects = pointerWithin(args)

      if (!pointerIntersects.length) return []
      // const intersects = pointerIntersects?.length
      //   ? pointerIntersects
      //   : rectIntersection({ ...args });
      let overId = getFirstCollision(pointerIntersects, 'id')
      if (overId) {
        const checkColumn = orderedColumns.find((c) => c._id === overId)
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter((container) => {
              return container.id !== overId && checkColumn.cardOrderIds.includes(container.id as string)
            })
          })[0]?.id
        }
        lastOverId.current = overId
        return [{ id: overId }]
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns]
  )

  return (
    <DndContext sensors={sensors} collisionDetection={collisionDetectionStrategy} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <SortableContext items={orderedColumns.map((c) => c._id) as UniqueIdentifier[]} strategy={horizontalListSortingStrategy}>
        <div className='flex space-x-4 overflow-x-auto pb-4'>
          {orderedColumns.map((column: ColumnType) => (
            <Column {...column} key={column._id} createNewCard={createNewCard} />
          ))}
          <div className='flex-col mt-2'>
            {openNewColumnForm ? (
              <>
                <div className='flex items-center gap-2'>
                  <Input
                    type='text'
                    placeholder='Enter a title for this card...'
                    autoFocus
                    data-no-dnd='true'
                    className='hover:border-green-400 hover:text-green-400'
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addNewColumnData()
                      }
                      if (e.key === 'Escape') {
                        toggleNewColumnForm()
                      }
                    }}
                  />
                  <X className='size-6 cursor-pointer text-gray-600 hover:text-gray-800 transition-all duration-300 ease-in-out hover:rotate-90 hover:scale-110' onClick={toggleNewColumnForm} />
                  <Button type='button' variant='outline' className='h-8 w-24 hover:border-green-400 hover:text-green-400' onClick={addNewColumnData}>
                    add column
                  </Button>
                </div>
              </>
            ) : (
              <Button
                type='button'
                variant='outline'
                className='max-w-[250px] bg-slate-500/50 hover:bg-slate-700/50 transition-all duration-300 ease-in-out transform hover:scale-105'
                onClick={toggleNewColumnForm}
              >
                <PlusCircleIcon className='size-4' />
                Add new column
              </Button>
            )}
          </div>
        </div>
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimation}>
        {!activeDragItemType && null}
        {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && activeDragItemData && <Column {...(activeDragItemData as ColumnType)} />}
        {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && activeDragItemData && (
          <div>
            <Card key={String((activeDragItemData as CardType)._id)} {...(activeDragItemData as CardType)} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
