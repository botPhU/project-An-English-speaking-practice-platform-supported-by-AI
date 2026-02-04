import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';

interface Comment {
    id: number;
    content: string;
    user_id: number;
    user_name: string;
    user_avatar?: string;
    resource_type: 'lesson' | 'course' | 'forum' | 'review';
    resource_id: number;
    resource_title: string;
    status: 'pending' | 'approved' | 'rejected' | 'flagged';
    flag_reason?: string;
    created_at: string;
    reports_count: number;
}

export default function ContentModeration() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'pending' | 'flagged' | 'all'>('pending');
    const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

    useEffect(() => {
        fetchComments();
    }, [filter]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/admin/moderation/comments?status=${filter}`);
            setComments(response.data.comments || []);
        } catch (error) {
            // Mock data
            setComments([
                {
                    id: 1,
                    content: 'This lesson was really helpful! Thank you so much.',
                    user_id: 101,
                    user_name: 'Nguyễn Văn A',
                    resource_type: 'lesson',
                    resource_id: 1,
                    resource_title: 'Present Perfect Tense',
                    status: 'pending',
                    created_at: '2026-02-03T10:30:00',
                    reports_count: 0
                },
                {
                    id: 2,
                    content: 'Spam content here... buy my product!!! Visit my website!!!',
                    user_id: 102,
                    user_name: 'SpamBot123',
                    resource_type: 'forum',
                    resource_id: 5,
                    resource_title: 'English Learning Tips',
                    status: 'flagged',
                    flag_reason: 'spam',
                    created_at: '2026-02-02T15:00:00',
                    reports_count: 5
                },
                {
                    id: 3,
                    content: 'Great course, learned a lot about vocabulary!',
                    user_id: 103,
                    user_name: 'Trần Thị B',
                    resource_type: 'review',
                    resource_id: 2,
                    resource_title: 'Business English',
                    status: 'pending',
                    created_at: '2026-02-01T09:15:00',
                    reports_count: 0
                },
                {
                    id: 4,
                    content: 'I disagree with the teaching method... [offensive words removed]',
                    user_id: 104,
                    user_name: 'User104',
                    resource_type: 'lesson',
                    resource_id: 3,
                    resource_title: 'Speaking Practice',
                    status: 'flagged',
                    flag_reason: 'inappropriate',
                    created_at: '2026-01-30T14:45:00',
                    reports_count: 3
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = (id: number) => {
        setComments(comments.map(c =>
            c.id === id ? { ...c, status: 'approved' as const } : c
        ));
        setSelectedComment(null);
    };

    const handleReject = (id: number) => {
        setComments(comments.map(c =>
            c.id === id ? { ...c, status: 'rejected' as const } : c
        ));
        setSelectedComment(null);
    };

    const handleDelete = (id: number) => {
        if (!confirm('Xóa vĩnh viễn nội dung này?')) return;
        setComments(comments.filter(c => c.id !== id));
        setSelectedComment(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'approved': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'flagged': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'lesson': return '📖';
            case 'course': return '📚';
            case 'forum': return '💬';
            case 'review': return '⭐';
            default: return '📄';
        }
    };

    const filteredComments = comments.filter(c => {
        if (filter === 'pending') return c.status === 'pending';
        if (filter === 'flagged') return c.status === 'flagged';
        return true;
    });

    const stats = {
        pending: comments.filter(c => c.status === 'pending').length,
        flagged: comments.filter(c => c.status === 'flagged').length,
        approved: comments.filter(c => c.status === 'approved').length,
        rejected: comments.filter(c => c.status === 'rejected').length
    };

    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">🛡️ Kiểm duyệt Nội dung</h1>
                    <p className="text-gray-600">Xem xét và phê duyệt bình luận từ người dùng</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <button
                        onClick={() => setFilter('pending')}
                        className={`bg-white rounded-xl p-4 shadow hover:shadow-lg transition ${filter === 'pending' ? 'ring-2 ring-yellow-500' : ''}`}
                    >
                        <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                        <p className="text-sm text-gray-500">⏳ Chờ duyệt</p>
                    </button>
                    <button
                        onClick={() => setFilter('flagged')}
                        className={`bg-white rounded-xl p-4 shadow hover:shadow-lg transition ${filter === 'flagged' ? 'ring-2 ring-orange-500' : ''}`}
                    >
                        <p className="text-3xl font-bold text-orange-600">{stats.flagged}</p>
                        <p className="text-sm text-gray-500">🚩 Bị báo cáo</p>
                    </button>
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                        <p className="text-sm text-gray-500">✓ Đã duyệt</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                        <p className="text-sm text-gray-500">✗ Từ chối</p>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 mb-4">
                    {[
                        { id: 'pending', label: '⏳ Chờ duyệt' },
                        { id: 'flagged', label: '🚩 Bị báo cáo' },
                        { id: 'all', label: '📋 Tất cả' }
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id as typeof filter)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === f.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Comments List */}
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-4 border-b bg-gray-50">
                            <h2 className="font-bold text-gray-800">Danh sách nội dung ({filteredComments.length})</h2>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                            </div>
                        ) : filteredComments.length === 0 ? (
                            <div className="p-8 text-center">
                                <span className="text-4xl">✅</span>
                                <p className="mt-2 text-gray-500">Không có nội dung cần kiểm duyệt</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                                {filteredComments.map((comment) => (
                                    <button
                                        key={comment.id}
                                        onClick={() => setSelectedComment(comment)}
                                        className={`w-full p-4 text-left hover:bg-gray-50 transition ${selectedComment?.id === comment.id ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                                    {comment.user_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{comment.user_name}</p>
                                                    <p className="text-sm text-gray-500 line-clamp-2">{comment.content}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(comment.status)}`}>
                                                {comment.status}
                                            </span>
                                        </div>
                                        {comment.reports_count > 0 && (
                                            <p className="text-xs text-red-500 mt-2">🚩 {comment.reports_count} báo cáo</p>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Detail Panel */}
                    <div className="bg-white rounded-xl shadow p-6">
                        {selectedComment ? (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Chi tiết nội dung</h2>
                                    <span className={`px-3 py-1 rounded ${getStatusColor(selectedComment.status)}`}>
                                        {selectedComment.status}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Người đăng</p>
                                        <p className="font-medium">{selectedComment.user_name} (ID: {selectedComment.user_id})</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Nội dung</p>
                                        <p className="p-3 bg-gray-50 rounded-lg">{selectedComment.content}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Nguồn</p>
                                        <p className="font-medium">
                                            {getResourceIcon(selectedComment.resource_type)} {selectedComment.resource_title}
                                        </p>
                                    </div>

                                    {selectedComment.flag_reason && (
                                        <div className="p-3 bg-red-50 rounded-lg">
                                            <p className="text-sm text-red-600">🚩 Lý do báo cáo: {selectedComment.flag_reason}</p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm text-gray-500">Thời gian</p>
                                        <p>{new Date(selectedComment.created_at).toLocaleString('vi-VN')}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => handleApprove(selectedComment.id)}
                                        className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        ✓ Phê duyệt
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedComment.id)}
                                        className="flex-1 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                                    >
                                        ✗ Từ chối
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedComment.id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <span className="text-6xl">👈</span>
                                <p className="mt-4 text-gray-500">Chọn một nội dung để xem chi tiết</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
