import { useState } from 'react';
import { learnerService } from '../services/learnerService';
import { useAuth } from '../context/AuthContext';

interface BookingModalProps {
    mentor: {
        id: number;
        name?: string;
        full_name?: string;
        specialty?: string;
    };
    onClose: () => void;
    onSuccess: () => void;
}

export default function BookingModal({ mentor, onClose, onSuccess }: BookingModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        scheduled_date: '',
        scheduled_time: '',
        topic: '',
        notes: '',
        duration_minutes: 30
    });

    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00',
        '14:00', '15:00', '16:00', '17:00', '19:00', '20:00'
    ];

    const topics = [
        'Ngữ pháp cơ bản',
        'Luyện phát âm',
        'Giao tiếp hàng ngày',
        'Chuẩn bị IELTS',
        'Tiếng Anh công sở',
        'Khác'
    ];

    // Get min date (tomorrow)
    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const handleSubmit = async () => {
        if (!formData.scheduled_date || !formData.scheduled_time || !user) {
            alert('Vui lòng chọn ngày và giờ');
            return;
        }

        setLoading(true);
        try {
            const response = await learnerService.createBooking({
                learner_id: Number(user.id),
                mentor_id: mentor.id,
                scheduled_date: formData.scheduled_date,
                scheduled_time: formData.scheduled_time,
                topic: formData.topic,
                notes: formData.notes,
                duration_minutes: formData.duration_minutes
            });

            if (response.data?.id) {
                alert('Đặt lịch thành công! Mentor sẽ xác nhận sớm.');
                onSuccess();
                onClose();
            } else if (response.data?.error) {
                alert(`Lỗi: ${response.data.error}`);
            } else {
                alert('Có lỗi xảy ra khi đặt lịch');
            }
        } catch (error: any) {
            console.error('Booking error:', error);
            const errorMsg = error.response?.data?.error || error.message || 'Có lỗi xảy ra';
            alert(`Lỗi: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a222a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-border-dark flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">Đặt lịch học</h2>
                        <p className="text-text-secondary text-sm">với {mentor.full_name || mentor.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                        <span className="material-symbols-outlined text-gray-400">close</span>
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-5">
                    {/* Date */}
                    <div>
                        <label className="block text-white font-medium mb-2">Ngày học</label>
                        <input
                            type="date"
                            min={getMinDate()}
                            value={formData.scheduled_date}
                            onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl bg-[#283039] text-white border border-border-dark focus:border-primary outline-none"
                        />
                    </div>

                    {/* Time Slots */}
                    <div>
                        <label className="block text-white font-medium mb-2">Giờ học</label>
                        <div className="grid grid-cols-5 gap-2">
                            {timeSlots.map(time => (
                                <button
                                    key={time}
                                    onClick={() => setFormData(prev => ({ ...prev, scheduled_time: time }))}
                                    className={`py-2 rounded-lg text-sm font-medium transition-all ${formData.scheduled_time === time
                                        ? 'bg-primary text-white'
                                        : 'bg-[#283039] text-gray-400 hover:bg-[#3e4854]'
                                        }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-white font-medium mb-2">Thời lượng</label>
                        <div className="flex gap-2">
                            {[30, 45, 60].map(mins => (
                                <button
                                    key={mins}
                                    onClick={() => setFormData(prev => ({ ...prev, duration_minutes: mins }))}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${formData.duration_minutes === mins
                                        ? 'bg-primary text-white'
                                        : 'bg-[#283039] text-gray-400 hover:bg-[#3e4854]'
                                        }`}
                                >
                                    {mins} phút
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Topic */}
                    <div>
                        <label className="block text-white font-medium mb-2">Chủ đề</label>
                        <select
                            value={formData.topic}
                            onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl bg-[#283039] text-white border border-border-dark focus:border-primary outline-none"
                        >
                            <option value="">Chọn chủ đề</option>
                            {topics.map(topic => (
                                <option key={topic} value={topic}>{topic}</option>
                            ))}
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-white font-medium mb-2">Ghi chú (tùy chọn)</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Những điều bạn muốn mentor biết trước..."
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
                        disabled={loading || !formData.scheduled_date || !formData.scheduled_time}
                        className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">event</span>
                                Đặt lịch
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
