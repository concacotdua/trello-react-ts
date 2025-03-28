import { useState } from 'react'
import Card from './Card'
import { MoreHorizontal, Plus, X } from 'lucide-react'
import { CardType, ColumnType } from '@/types/data.types'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { Input } from './ui/input'
import { toast } from 'react-toastify'

type ColumnProps = ColumnType & {
  createNewCard?: (newCardData: CardType) => void
}

const Column = ({ cards, cardOrderIds, _id, title, createNewCard = () => {} }: ColumnProps) => {
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')

  const toggleNewCardForm = () => setOpenNewCardForm(!openNewCardForm)
  const addNewCardTitle = () => {
    if (!newCardTitle) {
      toast.error('Please enter a title for the new card', {
        position: 'top-right'
      })
      return
    }

    const newCardData = {
      title: newCardTitle,
      columnId: _id
    } as CardType

    createNewCard(newCardData)

    toggleNewCardForm()
    setNewCardTitle('')
  }
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: _id, data: { cards, cardOrderIds, _id, title } })

  const dndKitColumnStyle = {
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%'
  }

  // Use useMemo to prevent unnecessary re-ordering on each render
  const orderCards = cards

  return (
    <div
      ref={setNodeRef}
      style={dndKitColumnStyle}
      {...listeners}
      {...attributes}
      className={cn('flex h-full max-h-[calc(100vh-10rem)] w-[280px] shrink-0 flex-col rounded-lg border bg-card/95 p-2 md:w-72 md:p-3', isDragging && 'opacity-50')}
    >
      <div className='flex items-center justify-between pb-2 md:pb-3'>
        <div className='flex items-center gap-2'>
          <h3 className='text-sm font-semibold text-foreground'>{title}</h3>
          <span className='rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground md:px-2'>{cards.filter((card) => card.FE_placeholderCard).length === 1 ? '0' : cards.length}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='h-7 w-7 text-muted-foreground opacity-80 group-hover:opacity-100 md:h-8 md:w-8'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuItem>Add card...</DropdownMenuItem>
            <DropdownMenuItem>Copy list...</DropdownMenuItem>
            <DropdownMenuItem>Move list...</DropdownMenuItem>
            <DropdownMenuItem>Watch</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='text-destructive'>Archive this list</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='custom-scrollbar flex-1 overflow-y-auto overflow-x-hidden'>
        <SortableContext items={orderCards.map((card) => card._id)} strategy={verticalListSortingStrategy}>
          {orderCards.map((card) => (
            <div className='mb-3 last:mb-0' key={card._id}>
              <Card {...card} />
            </div>
          ))}
        </SortableContext>
        {/* Empty div for drop space */}
        <div className='h-2 w-full' aria-hidden='true' />
      </div>

      {openNewCardForm ? (
        <div className='mt-2 w-full relative'>
          <Input
            type='text'
            placeholder='Enter a title for this card...'
            autoFocus
            className='hover:border-green-400 hover:text-green-400'
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addNewCardTitle()
              }
              if (e.key === 'Escape') {
                toggleNewCardForm()
              }
            }}
          />
          <X
            className='absolute text-gray-600 right-2 top-1/2 -translate-y-1/2 size-4 cursor-pointer transition-all duration-300 ease-in-out hover:rotate-90 hover:scale-110'
            onClick={toggleNewCardForm}
          />
        </div>
      ) : (
        <Button variant='ghost' size='sm' className='max-w-[250px] mt-2 w-full justify-start text-muted-foreground hover:bg-accent hover:text-foreground' onClick={toggleNewCardForm}>
          <Plus className='mr-2 h-4 w-4' />
          Add a card
        </Button>
      )}
    </div>
  )
}

export default Column
