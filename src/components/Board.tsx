import { FC, ReactNode } from 'react';
import Header from './Header';

interface BoardProps {
    title: string;
    children: ReactNode;
}

const Board: FC<BoardProps> = ({ title, children }) => {
    return (
        <div className="min-h-screen bg-blue-700">
            {/* Header */}
            <Header title={title} />
            {/* Board Content */}
            <main className="p-6">
                {children}
            </main>
        </div>
    );
};

export default Board; 