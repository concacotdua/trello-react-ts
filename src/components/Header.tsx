import { Plus } from "lucide-react"
import { ModeToggle } from "./mode-toggle"

interface HeaderProps {
    title: string
}
export default function Header({ title }: HeaderProps) {
    return (
        <header className="bg-blue-800/50 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button className="p-2 text-white hover:bg-blue-600/50 rounded">
                        <span className="sr-only">Menu</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <span className="text-white text-xl font-semibold">{title}</span>
                </div>
                <div className="flex items-center space-x-4">
                    <ModeToggle />
                    <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-500">
                        <Plus className="w-4 h-4 mr-2" />
                        Create
                    </button>
                </div>
            </div>
        </header>
    )
}
