import { SearchCommand } from './Command'
export default function SearchBar() {
  return (
    <form className='mx-auto flex max-w-sm items-center rounded-lg md:max-w-xl'>
      <label htmlFor='simple-search' className='sr-only'>
        Search
      </label>
      <div className='relative w-full'>
        <div className='pointer-events-none absolute inset-y-0 left-0 hidden items-center ps-3 md:flex'>
          <SearchCommand />
        </div>
        <div>
          <input
            type='text'
            id='simple-search'
            className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-6 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 md:ps-20'
            placeholder='Search branch name...'
            required
          />
        </div>
      </div>
    </form>
  )
}
