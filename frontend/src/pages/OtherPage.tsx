import { useState, useEffect } from 'react';

const Other = () => {
    const emojis = ['☹️', '😣', '😖', '😫', '😩'];
    const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentEmojiIndex((prevIndex) => (prevIndex + 1) % emojis.length);
        }, 400);
        return () => clearInterval(interval);
    });

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100">
            <div className="text-9xl font-bold text-gray-800">404</div>
            <div className="text-2xl mt-4 text-gray-600">Page non trouvée</div>
            <div className="text-7xl mt-6 transition-all duration-300 transform hover:scale-125">
                {emojis[currentEmojiIndex]}
            </div>
        </div>
    )
};

export default Other;
