import { useState } from 'react';
import { mentorService } from '../services/mentorService';
import { useAuth } from '../context/AuthContext';

interface RateMentorModalProps {
    mentor: {
        id: number;
        name?: string;
        full_name?: string;
    };
    sessionId?: number;
    bookingId?: number;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function RateMentorModal({ mentor, sessionId, bookingId, onClose, onSuccess }: RateMentorModalProps) {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!user || rating === 0) {
            alert('Vui lòng chọn số sao đánh giá');
            return;
        }

        setLoading(true);
        try {
            const response = await mentorService.submitReview({
                learner_id: Number(user.id),
                mentor_id: mentor.id,
                rating,
                comment: comment.trim() || undefined,
                session_id: sessionId,
                booking_id: bookingId
            });

            if (response.data?.id) {
                alert('Cảm ơn bạn đã đánh giá!');
                onSuccess?.();
                onClose();
            } else if (response.data?.error) {
                alert(`Lỗi: ${response.data.error}`);
            }
        } catch (error: any) {
            console.error('Review error:', error);
            const errorMsg = error.response?.data?.error || 'Có lỗi xảy ra';
            alert(`Lỗi: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const mentorName = mentor.full_name || mentor.name || 'Mentor';

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a222a] rounded-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-border-dark text-center">
                    <h2 className="text-xl font-bold text-white">Đánh giá Mentor</h2>
                    <p className="text-text-secondary text-sm mt-1">{mentorName}</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Star Rating */}
                    <div className="text-center">
                        <p className="text-white font-medium mb-3">Bạn đánh giá như thế nào?</p>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <span
                                        className={`material-symbols-outlined text-4xl ${star <= (hoveredRating || rating)
                                                ? 'text-yellow-400'
                                                : 'text-gray-600'
                                            }`}
                                        style={{
                                            fontVariationSettings: star <= (hoveredRating || rating)
                                                ? "'FILL' 1"
                                                : "'FILL' 0"
                                        }}
                                    >
                                        star
                                    </span>
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-text-secondary mt-2">
                            {rating === 1 && 'Không hài lòng'}
                            {rating === 2 && 'Tạm được'}
                            {rating === 3 && 'Bình thường'}
                            {rating === 4 && 'Hài lòng'}
                            {rating === 5 && 'Rất hài lòng'}
                        </p>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-white font-medium mb-2">
                            Nhận xét (tùy chọn)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Chia sẻ trải nghiệm của bạn..."
                            className="w-full px-4 py-3 rounded-xl bg-[#283039] text-white border border-border-dark focus:border-primary outline-none resize-none h-24"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border-dark flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || rating === 0}
                        className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">send</span>
                                Gửi đánh giá
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
