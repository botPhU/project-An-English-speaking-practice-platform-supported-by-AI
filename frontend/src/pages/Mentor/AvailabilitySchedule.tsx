import { useState, useEffect } from 'react';
import MentorLayout from '../../layouts/MentorLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface TimeSlot {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    slot_duration: number;
    is_booked: boolean;
    is_active: boolean;
    notes?: string;
}

interface WeeklySchedule {
    [key: string]: {
        day_name: string;
        slots: TimeSlot[];
    };
}

export default function AvailabilitySchedule() {
    const { user } = useAuth();
    const [schedule, setSchedule] = useState<WeeklySchedule>({});
    const [weekStart, setWeekStart] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [newSlot, setNewSlot] = useState({
        start_time: '09:00',
        end_time: '10:00',
        slot_duration: 30,
        notes: ''
    });

    useEffect(() => {
        if (user?.id) {
            fetchWeeklySchedule();
        }
    }, [user?.id]);

    const fetchWeeklySchedule = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/mentor/availability/weekly/${user?.id}`);
            setSchedule(response.data.schedule || {});
            setWeekStart(response.data.week_start);
        } catch (error) {
            console.error('Failed to fetch schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlot = async () => {
        if (!selectedDate) return;

        try {
            await api.post('/api/mentor/availability/', {
                mentor_id: Number(user?.id),
                date: selectedDate,
                ...newSlot
            });

            setShowAddModal(false);
            setSelectedDate('');
            setNewSlot({ start_time: '09:00', end_time: '10:00', slot_duration: 30, notes: '' });
            fetchWeeklySchedule();
        } catch (error) {
            console.error('Failed to add slot:', error);
        }
    };

    const handleDeleteSlot = async (slotId: number) => {
        if (!confirm('Bạn có chắc muốn xóa khung giờ này?')) return;

        try {
            await api.delete(`/api/mentor/availability/${slotId}`);
            fetchWeeklySchedule();
        } catch (error) {
            console.error('Failed to delete slot:', error);
        }
    };

    const openAddModal = (date: string) => {
        setSelectedDate(date);
        setShowAddModal(true);
    };

    return (
        <MentorLayout>
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">📅 Lịch trình dạy</h1>
                        <p className="text-gray-600">Quản lý thời gian có thể dạy của bạn</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        Tuần: {weekStart}
                    </div>
                </div>

                {/* Weekly Calendar Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-7 gap-4">
                        {Object.entries(schedule).map(([date, dayData]) => (
                            <div key={date} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                {/* Day Header */}
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 text-white text-center">
                                    <p className="font-bold">{dayData.day_name}</p>
                                    <p className="text-sm opacity-80">{date.split('-').slice(1).join('/')}</p>
                                </div>

                                {/* Time Slots */}
                                <div className="p-3 min-h-[200px]">
                                    {dayData.slots.length === 0 ? (
                                        <p className="text-gray-400 text-xs text-center py-4">Chưa có lịch</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {dayData.slots.map((slot) => (
                                                <div
                                                    key={slot.id}
                                                    className={`p-2 rounded-lg text-xs ${slot.is_booked
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-green-100 text-green-700'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">
                                                            {slot.start_time} - {slot.end_time}
                                                        </span>
                                                        {!slot.is_booked && (
                                                            <button
                                                                onClick={() => handleDeleteSlot(slot.id)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </div>
                                                    {slot.is_booked && (
                                                        <p className="text-xs mt-1">📌 Đã đặt</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add Button */}
                                    <button
                                        onClick={() => openAddModal(date)}
                                        className="w-full mt-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-500 transition"
                                    >
                                        + Thêm
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Slot Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                ➕ Thêm khung giờ dạy
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">Ngày: {selectedDate}</p>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bắt đầu</label>
                                        <input
                                            type="time"
                                            value={newSlot.start_time}
                                            onChange={(e) => setNewSlot(s => ({ ...s, start_time: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kết thúc</label>
                                        <input
                                            type="time"
                                            value={newSlot.end_time}
                                            onChange={(e) => setNewSlot(s => ({ ...s, end_time: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng slot (phút)</label>
                                    <select
                                        value={newSlot.slot_duration}
                                        onChange={(e) => setNewSlot(s => ({ ...s, slot_duration: Number(e.target.value) }))}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value={15}>15 phút</option>
                                        <option value={30}>30 phút</option>
                                        <option value={45}>45 phút</option>
                                        <option value={60}>60 phút</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                                    <textarea
                                        value={newSlot.notes}
                                        onChange={(e) => setNewSlot(s => ({ ...s, notes: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        rows={2}
                                        placeholder="Ghi chú (tùy chọn)"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleAddSlot}
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tips */}
                <div className="mt-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">💡 Mẹo quản lý lịch</h3>
                    <ul className="space-y-2 opacity-90">
                        <li>✓ Cập nhật lịch thường xuyên để học viên dễ đặt lịch</li>
                        <li>✓ Đặt thời lượng slot phù hợp với nội dung dạy</li>
                        <li>✓ Giữ khoảng nghỉ giữa các buổi học</li>
                    </ul>
                </div>
            </div>
        </MentorLayout>
    );
}
