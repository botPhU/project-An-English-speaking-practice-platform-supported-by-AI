import React from 'react';

interface AIAvatarProps {
    state: 'idle' | 'listening' | 'speaking' | 'thinking';
    size?: 'sm' | 'md' | 'lg';
}

/**
 * AI Tutor Avatar with animated states
 * - idle: Waiting for user
 * - listening: User is speaking (wave animation)
 * - speaking: AI is responding
 * - thinking: AI is processing
 */
const AIAvatar: React.FC<AIAvatarProps> = ({ state, size = 'lg' }) => {
    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32'
    };

    const getStateStyles = () => {
        switch (state) {
            case 'listening':
                return 'ring-4 ring-primary animate-pulse';
            case 'speaking':
                return 'ring-4 ring-purple-500 animate-[pulse_1s_ease-in-out_infinite]';
            case 'thinking':
                return 'ring-4 ring-yellow-500 animate-spin-slow';
            default:
                return 'ring-2 ring-[#3b4754]';
        }
    };

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Avatar Container */}
            <div className={`relative ${sizeClasses[size]}`}>
                {/* Outer glow based on state */}
                <div
                    className={`absolute inset-0 rounded-full blur-xl opacity-30 ${state === 'listening' ? 'bg-primary' :
                            state === 'speaking' ? 'bg-purple-500' :
                                state === 'thinking' ? 'bg-yellow-500' :
                                    'bg-[#3b4754]'
                        }`}
                />

                {/* Avatar circle */}
                <div
                    className={`relative w-full h-full rounded-full bg-gradient-to-br from-[#283039] to-[#1a222a] flex items-center justify-center ${getStateStyles()} transition-all duration-300`}
                >
                    {/* AI Icon/Emoji */}
                    <div className="text-4xl">
                        {state === 'thinking' ? '🤔' : '🤖'}
                    </div>

                    {/* Sound waves for listening state */}
                    {state === 'listening' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="absolute w-full h-full rounded-full border-2 border-primary/50 animate-ping" />
                            <div className="absolute w-[120%] h-[120%] rounded-full border border-primary/30 animate-ping" style={{ animationDelay: '0.5s' }} />
                        </div>
                    )}

                    {/* Speaking animation */}
                    {state === 'speaking' && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="w-1.5 h-3 bg-purple-500 rounded-full animate-bounce"
                                    style={{ animationDelay: `${i * 150}ms` }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Status text */}
            <p className={`text-sm font-medium ${state === 'listening' ? 'text-primary' :
                    state === 'speaking' ? 'text-purple-400' :
                        state === 'thinking' ? 'text-yellow-400' :
                            'text-[#9dabb9]'
                }`}>
                {state === 'idle' && 'AI Tutor sẵn sàng'}
                {state === 'listening' && 'Đang nghe...'}
                {state === 'speaking' && 'Đang phản hồi...'}
                {state === 'thinking' && 'Đang xử lý...'}
            </p>
        </div>
    );
};

export default AIAvatar;
