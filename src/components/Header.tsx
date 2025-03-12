import { Menu } from 'lucide-react'
import { ModeToggle } from './mode-toggle'
import trelloIcon from '../assets/trello.svg'
import WorkSpace from './MenuHeader/WorkSpace'
import Notification from './MenuHeader/Notify'
import AvatarUser from './MenuHeader/AvatarUser'
import SearchBar from './MenuHeader/SearchBar'

export default function Header() {
  return (
    <header className='sticky top-0 z-50 border-b bg-blue-800/95 backdrop-blur supports-[backdrop-filter]:bg-blue-800/60'>
      <div className='flex h-16 items-center justify-between px-4'>
        <div className='flex items-center space-x-4'>
          <button className='block rounded p-2 text-white hover:bg-blue-600/50 md:hidden'>
            <span className='sr-only'>Menu</span>
            <Menu />
          </button>
          <div className='hidden flex-shrink-0 items-center space-x-2 md:flex'>
            <img src={trelloIcon} alt='Trello' className='h-6 w-6 rounded-lg bg-green-400' />
            <span className='font-sans text-xl font-bold text-white'>Trello</span>
          </div>
          <div className='hidden md:block'>
            <WorkSpace />
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          <SearchBar />
          <ModeToggle />
          <Notification />
          <AvatarUser />
        </div>
      </div>
    </header>
  )
}
