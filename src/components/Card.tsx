import { FC } from 'react';

interface CardProps {
    title: string;
    label?: {
        color: string;
        text?: string;
    };
    commentCount?: number;
}

const Card: FC<CardProps> = ({ title, label, commentCount }) => {
    return (
        <div className="bg-white rounded shadow p-3 cursor-pointer hover:bg-gray-50">
            {label && (
                <div className="mb-2">
                    <span
                        className={`inline-block h-2 w-8 rounded-full ${label.color === 'red' ? 'bg-red-400' :
                                label.color === 'blue' ? 'bg-blue-400' :
                                    label.color === 'green' ? 'bg-green-400' :
                                        label.color === 'yellow' ? 'bg-yellow-400' :
                                            'bg-gray-400'
                            }`}
                    />
                </div>
            )}

            <p className="text-sm text-gray-700 font-medium">{title}</p>

            {commentCount !== undefined && commentCount > 0 && (
                <div className="mt-2 flex items-center text-gray-500 text-xs">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    {commentCount}
                </div>
            )}
        </div>
    );
};

export default Card; 