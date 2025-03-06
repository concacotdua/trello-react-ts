import { FC } from 'react';
import Card from './Card';

interface ColumnProps {
    title: string;
    cards: {
        id: string;
        title: string;
        label?: {
            color: string;
            text?: string;
        };
        commentCount?: number;
    }[];
}

const Column: FC<ColumnProps> = ({ title, cards }) => {
    return (
        <div className="w-72 shrink-0 bg-gray-100 rounded-lg p-3">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">{title}</h3>
                <button className="text-gray-500 hover:text-gray-700">
                    <span className="sr-only">More options</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>
            </div>

            <div className="space-y-2">
                {cards.map((card) => (
                    <Card key={card.id} {...card} />
                ))}
            </div>

            <button className="mt-2 w-full text-left text-gray-500 hover:text-gray-700 py-2 px-2 rounded hover:bg-gray-200">
                + Add a card
            </button>
        </div>
    );
};

export default Column; 