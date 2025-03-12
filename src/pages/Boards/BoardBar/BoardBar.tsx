import { AvatarCircles } from '@/components/magicui/avatar-circles'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AVATARS } from '@/constants/data'
import { BoardType } from '@/types/data.types'
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
  return (
    <div className='mb-4 w-full overflow-x-auto px-2'>
      <div className='grid grid-cols-12 gap-2'>
        <div className='col-span-6 items-center justify-start gap-2 sm:col-span-7 sm:flex md:col-span-9'>
          {Chip.map((item) => {
            return (
              <Badge key={item.label} variant='outline' className='rounded-lg px-4 font-bold capitalize text-green-800/70 hover:bg-black/30'>
                {board?.type === 'public' ? (
                  <div className='flex items-center gap-2'>
                    {item.icon}
                    <label className='hidden md:block md:text-xs'>{item.label}</label>
                  </div>
                ) : (
                  ''
                )}
              </Badge>
            )
          })}
        </div>
        <div className='col-span-6 items-center justify-end gap-2 sm:col-span-7 sm:flex md:col-span-3'>
          <Button className='rounded-full bg-green-600/70 font-bold text-white hover:bg-green-800/90'>
            <UserPlus2 className='h-4 w-4' />
            Invite
          </Button>
          <AvatarCircles numPeople={99} avatarUrls={AVATARS} />
        </div>
      </div>
    </div>
  )
}
