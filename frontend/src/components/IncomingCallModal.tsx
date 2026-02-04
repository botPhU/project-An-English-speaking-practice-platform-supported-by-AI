import { useState, useEffect } from 'react';

interface IncomingCallModalProps {
    callerName: string;
    callerAvatar?: string;
    roomName: string;
    onAccept: () => void;
    onDecline: () => void;
    isOpen: boolean;
}

const IncomingCallModal = ({
    callerName,
    callerAvatar,
    roomName: _roomName, // Required by interface but used internally via props
    onAccept,
    onDecline,
    isOpen
}: IncomingCallModalProps) => {
    const [timeLeft, setTimeLeft] = useState(30); // 30 seconds to answer

    // Countdown timer
    useEffect(() => {
        if (!isOpen) {
            setTimeLeft(30);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    onDecline(); // Auto decline after timeout
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, onDecline]);

    // Play ringtone (optional - uses browser notification sound)
    useEffect(() => {
        if (isOpen) {
            // Create a simple audio context for ringtone
            try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 440;
                oscillator.type = 'sine';
                gainNode.gain.value = 0.1;

                // Pulsing ring pattern
                const ringPattern = () => {
                    if (!isOpen) return;
                    oscillator.start();
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    setTimeout(() => {
                        oscillator.stop();
                    }, 500);
                };

                ringPattern();
                const ringInterval = setInterval(ringPattern, 2000);

                return () => {
                    clearInterval(ringInterval);
                    audioContext.close();
                };
            } catch (e) {
                console.log('Audio not supported');
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="bg-gradient-to-b from-[#1e2836] to-[#141c27] rounded-3xl w-[380px] p-8 shadow-2xl border border-[#3e4854]/50 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-4">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Cuộc gọi đến
                    </div>
                    <h2 className="text-xl font-bold text-white">Cuộc gọi Video</h2>
                </div>

                {/* Caller Avatar with Pulsing Animation */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        {/* Pulsing rings */}
                        <div className="absolute inset-0 -m-4">
                            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></span>
                        </div>
                        <div className="absolute inset-0 -m-2">
                            <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse"></span>
                        </div>

                        {/* Avatar */}
                        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-primary shadow-lg shadow-primary/30">
                            <img
                                src={callerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${callerName}`}
                                alt={callerName}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Video icon badge */}
                        <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-white text-xl">videocam</span>
                        </div>
                    </div>
                </div>

                {/* Caller Name */}
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-1">{callerName}</h3>
                    <p className="text-gray-400">đang gọi cho bạn...</p>
                    <p className="text-xs text-gray-500 mt-2">
                        Tự động từ chối sau {timeLeft}s
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-6">
                    {/* Decline Button */}
                    <button
                        onClick={onDecline}
                        className="group flex flex-col items-center gap-2"
                    >
                        <div className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 transition-all group-hover:scale-110">
                            <span className="material-symbols-outlined text-white text-2xl">call_end</span>
                        </div>
                        <span className="text-sm text-gray-400">Từ chối</span>
                    </button>

                    {/* Accept Button */}
                    <button
                        onClick={onAccept}
                        className="group flex flex-col items-center gap-2"
                    >
                        <div className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition-all group-hover:scale-110 animate-bounce">
                            <span className="material-symbols-outlined text-white text-2xl">videocam</span>
                        </div>
                        <span className="text-sm text-gray-400">Chấp nhận</span>
                    </button>
                </div>

                {/* Progress bar */}
                <div className="mt-6 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-1000 ease-linear"
                        style={{ width: `${(timeLeft / 30) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default IncomingCallModal;
