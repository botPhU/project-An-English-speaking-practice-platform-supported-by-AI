import { useState, useEffect } from 'react';
import { studyBuddyService, PotentialBuddy, MatchResult } from '../services/studyBuddyService';
import VideoCallModal from './VideoCallModal';

interface StudyBuddyMatcherProps {
    userId: number;
    userName: string;
    userLevel?: string;
}

const StudyBuddyMatcher = ({ userId, userName, userLevel }: StudyBuddyMatcherProps) => {
    const [isSearching, setIsSearching] = useState(false);
    const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
    const [potentialBuddies, setPotentialBuddies] = useState<PotentialBuddy[]>([]);
    const [loading, setLoading] = useState(true);
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [topic, setTopic] = useState('');

    useEffect(() => {
        fetchPotentialBuddies();
    }, [userId]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSearching) {
            // Poll for match status
            interval = setInterval(async () => {
                const status = await studyBuddyService.checkStatus(userId);
                if (status.matched) {
                    setMatchResult(status);
                    setIsSearching(false);
                }
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isSearching, userId]);

    const fetchPotentialBuddies = async () => {
        try {
            setLoading(true);
            const buddies = await studyBuddyService.findBuddies(userId, userLevel);
            setPotentialBuddies(buddies);
        } catch (error) {
            console.error('Error fetching buddies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartMatching = async () => {
        setIsSearching(true);
        try {
            const result = await studyBuddyService.requestMatch(userId, topic, userLevel);
            if (result.matched) {
                setMatchResult(result);
                setIsSearching(false);
            }
        } catch (error) {
            console.error('Error requesting match:', error);
            setIsSearching(false);
        }
    };

    const handleCancelSearch = async () => {
        await studyBuddyService.cancelRequest(userId);
        setIsSearching(false);
    };

    const handleStartSession = () => {
        setShowVideoCall(true);
    };

    const handleEndSession = async () => {
        await studyBuddyService.endSession(userId);
        setMatchResult(null);
        setShowVideoCall(false);
    };

    return (
        <>
            <div className="bg-[#283039] rounded-xl border border-[#3e4854]/30 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-[#3e4854]/30 bg-gradient-to-r from-primary/20 to-purple-600/20">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">group</span>
                        Tìm bạn học cùng
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">Luyện tập cùng người có trình độ tương đương</p>
                </div>

                <div className="p-4 space-y-4">
                    {/* Match Result */}
                    {matchResult?.matched && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                                    {matchResult.buddy?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-white">{matchResult.buddy?.full_name}</p>
                                    <p className="text-sm text-green-400">Đã ghép cặp!</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={handleStartSession}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
                                >
                                    <span className="material-symbols-outlined text-sm">videocam</span>
                                    Bắt đầu học
                                </button>
                                <button
                                    onClick={handleEndSession}
                                    className="px-4 py-2 bg-[#3e4854]/50 text-white rounded-lg font-medium hover:bg-[#3e4854]"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Searching State */}
                    {isSearching && !matchResult?.matched && (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                            <p className="text-white font-medium">Đang tìm bạn học...</p>
                            <p className="text-sm text-gray-400 mt-1">Vui lòng chờ trong giây lát</p>
                            <button
                                onClick={handleCancelSearch}
                                className="mt-4 px-6 py-2 bg-[#3e4854]/50 text-white rounded-lg font-medium hover:bg-[#3e4854]"
                            >
                                Hủy tìm kiếm
                            </button>
                        </div>
                    )}

                    {/* Search Form */}
                    {!isSearching && !matchResult?.matched && (
                        <>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Chủ đề muốn luyện tập (tùy chọn)</label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="VD: IELTS Speaking, Daily Conversation..."
                                    className="w-full px-4 py-3 bg-[#1a2230] border border-[#3e4854]/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <button
                                onClick={handleStartMatching}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
                            >
                                <span className="material-symbols-outlined">search</span>
                                Tìm bạn học ngay
                            </button>
                        </>
                    )}

                    {/* Online Buddies */}
                    {!isSearching && !matchResult?.matched && potentialBuddies.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-3">Người học đang online</h4>
                            <div className="space-y-2">
                                {potentialBuddies.filter(b => b.is_online).slice(0, 3).map(buddy => (
                                    <div key={buddy.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#3e4854]/30">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary/50 to-purple-600/50 flex items-center justify-center text-white text-sm font-bold">
                                                {buddy.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                            </div>
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#283039] rounded-full"></span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white">{buddy.full_name}</p>
                                            <p className="text-xs text-gray-500">{buddy.level} • {buddy.xp_points} XP</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Video Call Modal */}
            {matchResult?.room_name && (
                <VideoCallModal
                    isOpen={showVideoCall}
                    roomName={matchResult.room_name}
                    userName={userName}
                    onClose={() => {
                        setShowVideoCall(false);
                        handleEndSession();
                    }}
                />
            )}
        </>
    );
};

export default StudyBuddyMatcher;
