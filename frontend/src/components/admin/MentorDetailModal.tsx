import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

interface MentorDetailModalProps {
    mentorId: string;
    isOpen: boolean;
    onClose: () => void;
    onApprove?: (mentorId: string) => void;
    onReject?: (mentorId: string, reason: string) => void;
}

interface MentorDetails {
    id: string;
    name: string;
    email: string;
    phone?: string;
    specialty: string;
    bio?: string;
    rating: number;
    students: number;
    sessions_completed: number;
    status: 'active' | 'pending' | 'inactive';
    joined_date: string;
    certifications: string[];
    experience_years?: number;
    cv_url?: string;
}

const MentorDetailModal: React.FC<MentorDetailModalProps> = ({
    mentorId,
    isOpen,
    onClose,
    onApprove,
    onReject
}) => {
    const [mentor, setMentor] = useState<MentorDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'qualifications' | 'reviews'>('profile');

    useEffect(() => {
        if (isOpen && mentorId) {
            fetchMentorDetails();
        }
    }, [isOpen, mentorId]);

    const fetchMentorDetails = async () => {
        try {
            setLoading(true);
            const response = await adminService.getMentorDetails(mentorId);
            setMentor(response.data);
        } catch (error) {
            console.error('Error fetching mentor details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = () => {
        if (onApprove) {
            onApprove(mentorId);
        }
        onClose();
    };

    const handleReject = () => {
        if (onReject && rejectReason.trim()) {
            onReject(mentorId, rejectReason);
            setRejectReason('');
            setShowRejectForm(false);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#1a222a] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-[#3e4854]/50">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#3e4854]">
                    <h2 className="text-xl font-bold text-white">Chi tiết Mentor</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#283039] rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined text-[#9dabb9]">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
                    {loading ? (
                        <div className="p-8 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : mentor ? (
                        <div className="p-6">
                            {/* Profile Header */}
                            <div className="flex items-start gap-6 mb-6">
                                <div className="size-24 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary/20">
                                    {mentor.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-2xl font-bold text-white">{mentor.name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mentor.status === 'active' ? 'bg-[#0bda5b]/20 text-[#0bda5b]' :
                                                mentor.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                                    'bg-red-500/20 text-red-500'
                                            }`}>
                                            {mentor.status === 'active' ? 'Hoạt động' :
                                                mentor.status === 'pending' ? 'Chờ duyệt' : 'Không hoạt động'}
                                        </span>
                                    </div>
                                    <p className="text-[#9dabb9] text-sm mb-2">{mentor.email}</p>
                                    <p className="text-primary text-sm font-medium">{mentor.specialty}</p>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-2 mb-6 border-b border-[#3e4854]">
                                {[
                                    { id: 'profile', label: 'Hồ sơ', icon: 'person' },
                                    { id: 'qualifications', label: 'Chứng chỉ', icon: 'workspace_premium' },
                                    { id: 'reviews', label: 'Đánh giá', icon: 'star' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${activeTab === tab.id
                                                ? 'text-primary border-primary'
                                                : 'text-[#9dabb9] border-transparent hover:text-white'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-[#283039] rounded-xl p-4 text-center border border-[#3e4854]/30">
                                            <p className="text-3xl font-bold text-white">{mentor.rating}</p>
                                            <p className="text-sm text-[#9dabb9]">Đánh giá</p>
                                        </div>
                                        <div className="bg-[#283039] rounded-xl p-4 text-center border border-[#3e4854]/30">
                                            <p className="text-3xl font-bold text-white">{mentor.students}</p>
                                            <p className="text-sm text-[#9dabb9]">Học viên</p>
                                        </div>
                                        <div className="bg-[#283039] rounded-xl p-4 text-center border border-[#3e4854]/30">
                                            <p className="text-3xl font-bold text-white">{mentor.sessions_completed}</p>
                                            <p className="text-sm text-[#9dabb9]">Buổi học</p>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <h4 className="text-white font-semibold mb-2">Giới thiệu</h4>
                                        <p className="text-[#9dabb9] text-sm leading-relaxed">
                                            {mentor.bio || 'Chưa có thông tin giới thiệu'}
                                        </p>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#283039]/50 rounded-lg p-4 border border-[#3e4854]/20">
                                            <p className="text-xs text-[#9dabb9] mb-1">Ngày tham gia</p>
                                            <p className="text-white font-medium">{mentor.joined_date}</p>
                                        </div>
                                        <div className="bg-[#283039]/50 rounded-lg p-4 border border-[#3e4854]/20">
                                            <p className="text-xs text-[#9dabb9] mb-1">Kinh nghiệm</p>
                                            <p className="text-white font-medium">{mentor.experience_years || 0} năm</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'qualifications' && (
                                <div className="space-y-4">
                                    {mentor.certifications && mentor.certifications.length > 0 ? (
                                        mentor.certifications.map((cert, index) => (
                                            <div key={index} className="flex items-center gap-4 bg-[#283039] rounded-xl p-4 border border-[#3e4854]/30">
                                                <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                                                <div>
                                                    <p className="text-white font-medium">{cert}</p>
                                                    <p className="text-sm text-[#9dabb9]">Chứng chỉ đã xác minh</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-[#9dabb9]">
                                            <span className="material-symbols-outlined text-4xl opacity-30 mb-2">description</span>
                                            <p>Chưa có chứng chỉ nào</p>
                                        </div>
                                    )}

                                    {mentor.cv_url && (
                                        <a
                                            href={mentor.cv_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 bg-primary/10 rounded-xl p-4 border border-primary/20 hover:bg-primary/20 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-primary">description</span>
                                            <span className="text-primary font-medium">Xem CV</span>
                                        </a>
                                    )}
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="text-center py-8 text-[#9dabb9]">
                                    <span className="material-symbols-outlined text-4xl opacity-30 mb-2">rate_review</span>
                                    <p>Chưa có đánh giá nào</p>
                                </div>
                            )}

                            {/* Reject Form */}
                            {showRejectForm && (
                                <div className="mt-6 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                                    <h4 className="text-white font-semibold mb-2">Lý do từ chối</h4>
                                    <textarea
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Nhập lý do từ chối..."
                                        className="w-full bg-[#1a222a] border border-[#3e4854] rounded-lg p-3 text-white text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-[#9dabb9]">
                            <span className="material-symbols-outlined text-4xl opacity-30 mb-2">error</span>
                            <p>Không tìm thấy thông tin mentor</p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {mentor && mentor.status === 'pending' && (
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-[#3e4854]">
                        {showRejectForm ? (
                            <>
                                <button
                                    onClick={() => setShowRejectForm(false)}
                                    className="px-4 py-2 text-[#9dabb9] hover:text-white transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={!rejectReason.trim()}
                                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Xác nhận từ chối
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowRejectForm(true)}
                                    className="px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                                >
                                    Từ chối
                                </button>
                                <button
                                    onClick={handleApprove}
                                    className="px-6 py-2 bg-[#0bda5b] text-white rounded-lg hover:bg-[#0bda5b]/90 transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">check</span>
                                    Phê duyệt
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Close button for non-pending mentors */}
                {mentor && mentor.status !== 'pending' && (
                    <div className="flex items-center justify-end p-6 border-t border-[#3e4854]">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-[#283039] text-white rounded-lg hover:bg-[#3e4854] transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorDetailModal;
