import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';

interface Application {
    id: number;
    personal_info: {
        full_name: string;
        email: string;
        phone: string;
        date_of_birth: string | null;
    };
    professional_info: {
        current_job: string;
        company: string;
        years_experience: number;
    };
    education: {
        level: string;
        major: string;
        university: string;
    };
    english_qualifications: {
        certificates: { name: string; score: string; year: number }[];
        native_language: string;
        english_level: string;
    };
    teaching: {
        experience: string;
        specializations: string[];
        target_students: string[];
        available_hours: number;
        motivation: string;
        teaching_style: string;
    };
    status: string;
    created_at: string;
    rejection_reason?: string;
}

export default function MentorApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [stats, setStats] = useState({ pending: 0, reviewing: 0, approved: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, [filter]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/mentor-application/admin/list?status=${filter}`);
            setApplications(response.data.applications);
            setStats(response.data.stats);
        } catch (error) {
            // Mock data
            setApplications([
                {
                    id: 1,
                    personal_info: { full_name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0901234567', date_of_birth: '1990-05-15' },
                    professional_info: { current_job: 'English Teacher', company: 'ABC Language Center', years_experience: 5 },
                    education: { level: 'Master', major: 'English Education', university: 'Hanoi University of Languages' },
                    english_qualifications: { certificates: [{ name: 'IELTS', score: '8.0', year: 2022 }], native_language: 'Vietnamese', english_level: 'C1' },
                    teaching: { experience: '5 năm dạy IELTS và giao tiếp', specializations: ['IELTS', 'Conversation'], target_students: ['Intermediate', 'Advanced'], available_hours: 20, motivation: 'Muốn chia sẻ kiến thức...', teaching_style: 'Interactive and practical' },
                    status: 'pending',
                    created_at: '2026-02-01'
                },
                {
                    id: 2,
                    personal_info: { full_name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0912345678', date_of_birth: '1995-08-20' },
                    professional_info: { current_job: 'Corporate Trainer', company: 'XYZ Corp', years_experience: 3 },
                    education: { level: 'Bachelor', major: 'Business English', university: 'HCMC University' },
                    english_qualifications: { certificates: [{ name: 'TOEIC', score: '950', year: 2023 }], native_language: 'Vietnamese', english_level: 'C1' },
                    teaching: { experience: '3 năm training doanh nghiệp', specializations: ['Business English', 'TOEIC'], target_students: ['Business Professionals'], available_hours: 15, motivation: 'Đam mê giảng dạy...', teaching_style: 'Professional and practical' },
                    status: 'pending',
                    created_at: '2026-02-02'
                }
            ]);
            setStats({ pending: 2, reviewing: 1, approved: 5, rejected: 1 });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (app: Application) => {
        if (!confirm(`Duyệt đơn của ${app.personal_info.full_name}?`)) return;

        try {
            await api.post(`/api/mentor-application/admin/${app.id}/approve`, { admin_id: 1 });
            setApplications(applications.map(a => a.id === app.id ? { ...a, status: 'approved' } : a));
            setSelectedApp(null);
            alert('Đã duyệt! Tài khoản mentor đã được tạo.');
        } catch (error) {
            // Mock update
            setApplications(applications.filter(a => a.id !== app.id));
            setSelectedApp(null);
        }
    };

    const handleReject = async () => {
        if (!selectedApp) return;

        try {
            await api.post(`/api/mentor-application/admin/${selectedApp.id}/reject`, {
                admin_id: 1,
                reason: rejectReason
            });
            setApplications(applications.map(a =>
                a.id === selectedApp.id ? { ...a, status: 'rejected', rejection_reason: rejectReason } : a
            ));
        } catch (error) {
            setApplications(applications.filter(a => a.id !== selectedApp.id));
        }
        setShowRejectModal(false);
        setSelectedApp(null);
        setRejectReason('');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'reviewing': return 'bg-blue-100 text-blue-700';
            case 'approved': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return '⏳ Chờ duyệt';
            case 'reviewing': return '🔍 Đang xem xét';
            case 'approved': return '✅ Đã duyệt';
            case 'rejected': return '❌ Từ chối';
            default: return status;
        }
    };

    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">👨‍🏫 Duyệt đơn ứng tuyển Mentor</h1>
                    <p className="text-gray-600">Xem xét và phê duyệt hồ sơ ứng viên</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <button onClick={() => setFilter('pending')} className={`bg-white rounded-xl p-4 shadow hover:shadow-lg ${filter === 'pending' ? 'ring-2 ring-yellow-500' : ''}`}>
                        <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                        <p className="text-sm text-gray-500">⏳ Chờ duyệt</p>
                    </button>
                    <button onClick={() => setFilter('reviewing')} className={`bg-white rounded-xl p-4 shadow hover:shadow-lg ${filter === 'reviewing' ? 'ring-2 ring-blue-500' : ''}`}>
                        <p className="text-3xl font-bold text-blue-600">{stats.reviewing}</p>
                        <p className="text-sm text-gray-500">🔍 Đang xem</p>
                    </button>
                    <button onClick={() => setFilter('approved')} className={`bg-white rounded-xl p-4 shadow hover:shadow-lg ${filter === 'approved' ? 'ring-2 ring-green-500' : ''}`}>
                        <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                        <p className="text-sm text-gray-500">✅ Đã duyệt</p>
                    </button>
                    <button onClick={() => setFilter('rejected')} className={`bg-white rounded-xl p-4 shadow hover:shadow-lg ${filter === 'rejected' ? 'ring-2 ring-red-500' : ''}`}>
                        <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                        <p className="text-sm text-gray-500">❌ Từ chối</p>
                    </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* List */}
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-4 border-b bg-gray-50">
                            <h2 className="font-bold text-gray-800">Danh sách đơn ({applications.length})</h2>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                            </div>
                        ) : applications.length === 0 ? (
                            <div className="p-8 text-center">
                                <span className="text-4xl">📭</span>
                                <p className="mt-2 text-gray-500">Không có đơn nào</p>
                            </div>
                        ) : (
                            <div className="divide-y max-h-[600px] overflow-y-auto">
                                {applications.map((app) => (
                                    <button
                                        key={app.id}
                                        onClick={() => setSelectedApp(app)}
                                        className={`w-full p-4 text-left hover:bg-gray-50 ${selectedApp?.id === app.id ? 'bg-blue-50' : ''}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-gray-800">{app.personal_info.full_name}</p>
                                                <p className="text-sm text-gray-500">{app.personal_info.email}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {app.english_qualifications.english_level} • {app.professional_info.years_experience} năm KN
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(app.status)}`}>
                                                {getStatusLabel(app.status)}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Detail */}
                    <div className="bg-white rounded-xl shadow p-6">
                        {selectedApp ? (
                            <div className="max-h-[600px] overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">{selectedApp.personal_info.full_name}</h2>
                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedApp.status)}`}>
                                        {getStatusLabel(selectedApp.status)}
                                    </span>
                                </div>

                                {/* Personal */}
                                <div className="mb-4">
                                    <h3 className="font-bold text-gray-700 mb-2">👤 Thông tin cá nhân</h3>
                                    <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                                        <p>📧 {selectedApp.personal_info.email}</p>
                                        <p>📱 {selectedApp.personal_info.phone}</p>
                                        <p>💼 {selectedApp.professional_info.current_job} @ {selectedApp.professional_info.company}</p>
                                        <p>⏱️ {selectedApp.professional_info.years_experience} năm kinh nghiệm</p>
                                    </div>
                                </div>

                                {/* Education */}
                                <div className="mb-4">
                                    <h3 className="font-bold text-gray-700 mb-2">🎓 Học vấn</h3>
                                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                                        <p>{selectedApp.education.level} - {selectedApp.education.major}</p>
                                        <p className="text-gray-500">{selectedApp.education.university}</p>
                                    </div>
                                </div>

                                {/* Certificates */}
                                <div className="mb-4">
                                    <h3 className="font-bold text-gray-700 mb-2">📜 Chứng chỉ</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                            {selectedApp.english_qualifications.english_level}
                                        </span>
                                        {selectedApp.english_qualifications.certificates.map((cert, i) => (
                                            <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                                {cert.name}: {cert.score} ({cert.year})
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Teaching */}
                                <div className="mb-4">
                                    <h3 className="font-bold text-gray-700 mb-2">📚 Giảng dạy</h3>
                                    <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-2">
                                        <p><strong>Chuyên môn:</strong> {selectedApp.teaching.specializations.join(', ')}</p>
                                        <p><strong>Đối tượng:</strong> {selectedApp.teaching.target_students.join(', ')}</p>
                                        <p><strong>Thời gian:</strong> {selectedApp.teaching.available_hours} giờ/tuần</p>
                                        <p><strong>Kinh nghiệm:</strong> {selectedApp.teaching.experience}</p>
                                    </div>
                                </div>

                                {/* Motivation */}
                                <div className="mb-4">
                                    <h3 className="font-bold text-gray-700 mb-2">💡 Động lực</h3>
                                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{selectedApp.teaching.motivation}</p>
                                </div>

                                {/* Actions */}
                                {selectedApp.status === 'pending' && (
                                    <div className="flex gap-3 mt-6 pt-4 border-t">
                                        <button
                                            onClick={() => handleApprove(selectedApp)}
                                            className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            ✅ Duyệt & Tạo tài khoản
                                        </button>
                                        <button
                                            onClick={() => setShowRejectModal(true)}
                                            className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            ❌ Từ chối
                                        </button>
                                    </div>
                                )}

                                {selectedApp.status === 'rejected' && selectedApp.rejection_reason && (
                                    <div className="bg-red-50 rounded-lg p-3 mt-4">
                                        <p className="text-sm text-red-700">
                                            <strong>Lý do từ chối:</strong> {selectedApp.rejection_reason}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <span className="text-6xl">📋</span>
                                <p className="mt-4 text-gray-500">Chọn một đơn để xem chi tiết</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reject Modal */}
                {showRejectModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">❌ Từ chối đơn ứng tuyển</h3>
                            <textarea
                                placeholder="Lý do từ chối..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg"
                                rows={4}
                            />
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="flex-1 py-2 border rounded-lg"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="flex-1 py-2 bg-red-600 text-white rounded-lg"
                                >
                                    Xác nhận từ chối
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
