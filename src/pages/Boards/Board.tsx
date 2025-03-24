import { useState, useEffect, useCallback, useRef } from 'react'
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import {
  DndContext,
  UniqueIdentifier,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
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
import { PlusCircleIcon } from 'lucide-react'

import Column from '@/components/Column'
import { Button } from '@/components/ui/button'
import { BoardBarProps } from './BoardBar/BoardBar'
import { mapOrder } from '@/utils/sort'
import { CardType, ColumnType } from '@/types/data.types'
import { ACTIVE_DRAG_ITEM_TYPE } from '@/constants/active'
import Card from '@/components/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '@/utils/formattext'

export default function Board({ board }: BoardBarProps) {
  const [orderedColumns, setOrderedColumns] = useState<ColumnType[]>([])
  const [activeDragItemId, setActiveDragItemId] = useState<UniqueIdentifier | null>(null)
  const [activeDragItemType, setActiveDragItemType] = useState<string | null>(null)
  const [activeDragItemData, setActiveDragItemData] = useState<CardType | ColumnType | null>(null)
  const [oldColumnDragCard, setOldColumnDragCard] = useState<ColumnType | null>(null)

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
    if (!board?.columns) return
    const ordered = mapOrder(board?.columns as ColumnType[], board?.columnOrderIds || [], '_id')
    console.log('🔍 orderedColumns:', ordered)
    setOrderedColumns(ordered)
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
    activeDraggingCardData: any
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
      setOrderedColumns((prevColumns) => moveCardBetweenColumns(prevColumns, active, over, activeColumn, overColumn, activeDraggingCardId, activeDraggingCardData))
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
        setOrderedColumns((prevColumns) => moveCardBetweenColumns(prevColumns, active, over, activeColumn, overColumn, activeDraggingCardId, activeDraggingCardData))
      } else {
        const oldCardIndex = oldColumnDragCard.cards.findIndex((c) => c._id === activeDragItemId)
        const newCardIndex = overColumn.cards.findIndex((c) => c._id === overCardId)
        const newOrderCard = arrayMove(oldColumnDragCard.cards, oldCardIndex, newCardIndex)

        setOrderedColumns((prev) => {
          const nextColumns = cloneDeep(prev)
          const targetColumn = nextColumns.find((c) => c._id === overColumn._id)
          if (targetColumn) {
            targetColumn.cards = newOrderCard
            targetColumn.cardOrderIds = newOrderCard.map((card) => card._id)
          }
          return nextColumns
        })
      }
    }
    // If there's no valid drop target, reset the state and return

    // Handle column reordering
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex((c) => c._id === active.id)
        const newColumnIndex = orderedColumns.findIndex((c) => c._id === over.id)

        const newOrderColumn = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        setOrderedColumns(newOrderColumn)
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
          {orderedColumns.map((column) => (
            <Column {...column} key={column._id} />
          ))}
          <div className='flex-col'>
            <Button variant='outline' className='bg-slate-500/50 hover:bg-slate-700/50'>
              <PlusCircleIcon className='h-4 w-4' />
              Add new column
            </Button>
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
