import { AvatarCircles } from '@/components/magicui/avatar-circles'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AVATARS } from '@/constants/data'
import { BoardType } from '@/types/data.types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { HardDrive, LayoutDashboard, ListFilter, LockIcon, Repeat, UserPlus2 } from 'lucide-react'

export type BoardBarProps = {
  board?: BoardType
}
const Chip = [
  {
    icon: <LayoutDashboard className='mr-2 h-5 w-6 flex-shrink-0 fill-green-200' />,
    label: 'Quang Nguyen Trello - Nqux dev'
  },
  {
    icon: <LockIcon className='mr-2 h-5 w-6 flex-shrink fill-green-200' />,
    label: 'Public/Private Workspace'
  },
  {
    icon: <HardDrive className='mr-2 h-5 w-6 fill-green-200' />,
    label: 'Add to Google Drive'
  },
  {
    icon: <Repeat className='mr-2 h-5 w-6 flex-shrink fill-green-200' />,
    label: 'Automatic'
  },
  {
    icon: <ListFilter className='mr-2 h-5 w-6 flex-shrink fill-green-200' />,
    label: 'Filter'
  }
]
export default function BoardBar({ board }: BoardBarProps) {
  console.log('board bar: ', board)

  return (
    <div className='mb-4 w-full overflow-x-auto px-2'>
      <div className='grid grid-cols-12 gap-2'>
        <div className='col-span-6 items-center justify-start gap-2 sm:col-span-7 sm:flex md:col-span-9'>
          {Chip.map((item) => {
            return (
              <TooltipProvider key={item.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {board?.type === 'public' ? (
                      <Badge key={item.label} variant='outline' className='rounded-lg px-4 font-bold capitalize text-green-800/70 hover:bg-black/30'>
                        <div className='flex items-center gap-2'>
                          {item.icon}
                          <label className='hidden md:block md:text-xs'>{item.label}</label>
                        </div>
                      </Badge>
                    ) : (
                      ''
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
        <div className='col-span-6 flex items-center justify-end gap-2 sm:col-span-5 md:col-span-3'>
          <Button className='flex items-center gap-1 rounded-full bg-green-600/70 px-3 py-1.5 font-bold text-white hover:bg-green-800/90 sm:px-4'>
            <UserPlus2 className='h-4 w-4' />
            <span className='hidden sm:inline'>Invite</span>
          </Button>
          <div className='flex-shrink-0'>
            <AvatarCircles numPeople={99} avatarUrls={AVATARS} />
          </div>
        </div>
      </div>
    </div>
  )
}
