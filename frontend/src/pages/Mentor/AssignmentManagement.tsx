import { useState, useEffect } from 'react';
import MentorLayout from '../../layouts/MentorLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface Assignment {
    id: number;
    title: string;
    description: string;
    type: 'speaking' | 'writing' | 'listening' | 'vocabulary';
    difficulty: string;
    due_date: string;
    learner_id: number;
    learner_name: string;
    status: 'pending' | 'submitted' | 'graded';
    score?: number;
    feedback?: string;
    created_at: string;
}

interface Learner {
    id: number;
    full_name: string;
}

export default function AssignmentManagement() {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [learners, setLearners] = useState<Learner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

    const [newAssignment, setNewAssignment] = useState({
        title: '',
        description: '',
        type: 'speaking' as const,
        difficulty: 'A2',
        due_date: '',
        learner_id: 0
    });

    // Mock data for demo
    useEffect(() => {
        setLoading(true);

        // Mock assignments
        setAssignments([
            {
                id: 1,
                title: 'Describe your daily routine',
                description: 'Record a 2-minute video describing your typical day',
                type: 'speaking',
                difficulty: 'A2',
                due_date: '2026-02-10',
                learner_id: 1,
                learner_name: 'Nguyễn Văn A',
                status: 'submitted',
                created_at: '2026-02-01'
            },
            {
                id: 2,
                title: 'Write about your hobbies',
                description: 'Write a 200-word paragraph about your hobbies',
                type: 'writing',
                difficulty: 'B1',
                due_date: '2026-02-12',
                learner_id: 2,
                learner_name: 'Trần Thị B',
                status: 'pending',
                created_at: '2026-02-02'
            },
            {
                id: 3,
                title: 'Vocabulary quiz - Travel',
                description: 'Complete the travel vocabulary quiz',
                type: 'vocabulary',
                difficulty: 'A2',
                due_date: '2026-02-08',
                learner_id: 1,
                learner_name: 'Nguyễn Văn A',
                status: 'graded',
                score: 85,
                feedback: 'Rất tốt! Cần cải thiện pronunciation của từ "itinerary"',
                created_at: '2026-02-01'
            }
        ]);

        // Mock learners
        setLearners([
            { id: 1, full_name: 'Nguyễn Văn A' },
            { id: 2, full_name: 'Trần Thị B' },
            { id: 3, full_name: 'Lê Văn C' }
        ]);

        setLoading(false);
    }, [user?.id]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'speaking': return '🎤';
            case 'writing': return '✍️';
            case 'listening': return '🎧';
            case 'vocabulary': return '📚';
            default: return '📝';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'submitted': return 'bg-blue-100 text-blue-700';
            case 'graded': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Chờ nộp';
            case 'submitted': return 'Đã nộp';
            case 'graded': return 'Đã chấm';
            default: return status;
        }
    };

    const filteredAssignments = assignments.filter(a =>
        filter === 'all' || a.status === filter
    );

    const handleCreateAssignment = async () => {
        if (!newAssignment.title || !newAssignment.learner_id || !newAssignment.due_date) return;

        // In real app, call API
        const assignment: Assignment = {
            id: assignments.length + 1,
            ...newAssignment,
            learner_name: learners.find(l => l.id === newAssignment.learner_id)?.full_name || '',
            status: 'pending',
            created_at: new Date().toISOString().split('T')[0]
        };

        setAssignments([assignment, ...assignments]);
        setShowCreate(false);
        setNewAssignment({
            title: '',
            description: '',
            type: 'speaking',
            difficulty: 'A2',
            due_date: '',
            learner_id: 0
        });
    };

    return (
        <MentorLayout>
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">📝 Quản lý Bài tập</h1>
                        <p className="text-gray-600">Giao và chấm điểm bài tập cho học viên</p>
                    </div>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                    >
                        ➕ Giao bài mới
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Tổng', count: assignments.length, color: 'bg-gray-100 text-gray-700' },
                        { label: 'Chờ nộp', count: assignments.filter(a => a.status === 'pending').length, color: 'bg-yellow-100 text-yellow-700' },
                        { label: 'Đã nộp', count: assignments.filter(a => a.status === 'submitted').length, color: 'bg-blue-100 text-blue-700' },
                        { label: 'Đã chấm', count: assignments.filter(a => a.status === 'graded').length, color: 'bg-green-100 text-green-700' }
                    ].map((stat, idx) => (
                        <button
                            key={idx}
                            onClick={() => setFilter(idx === 0 ? 'all' : ['pending', 'submitted', 'graded'][idx - 1] as typeof filter)}
                            className={`p-4 rounded-xl ${stat.color} ${filter === (idx === 0 ? 'all' : ['pending', 'submitted', 'graded'][idx - 1]) ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                        >
                            <p className="text-3xl font-bold">{stat.count}</p>
                            <p className="text-sm">{stat.label}</p>
                        </button>
                    ))}
                </div>

                {/* Assignment List */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : filteredAssignments.length === 0 ? (
                        <div className="p-12 text-center">
                            <span className="text-6xl">📭</span>
                            <p className="mt-4 text-gray-500">Chưa có bài tập nào</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredAssignments.map((assignment) => (
                                <div key={assignment.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl">{getTypeIcon(assignment.type)}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-gray-800">{assignment.title}</h3>
                                                <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(assignment.status)}`}>
                                                    {getStatusText(assignment.status)}
                                                </span>
                                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                                                    {assignment.difficulty}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-2">{assignment.description}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                                <span>👤 {assignment.learner_name}</span>
                                                <span>📅 Hạn: {assignment.due_date}</span>
                                                {assignment.score && (
                                                    <span className="text-green-600 font-medium">⭐ {assignment.score}/100</span>
                                                )}
                                            </div>
                                            {assignment.feedback && (
                                                <p className="mt-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                                                    💬 {assignment.feedback}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            {assignment.status === 'submitted' && (
                                                <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200">
                                                    ✓ Chấm điểm
                                                </button>
                                            )}
                                            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">
                                                Xem
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Modal */}
                {showCreate && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">➕ Giao bài tập mới</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                                    <input
                                        type="text"
                                        value={newAssignment.title}
                                        onChange={(e) => setNewAssignment(a => ({ ...a, title: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="VD: Describe your daily routine"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                    <textarea
                                        value={newAssignment.description}
                                        onChange={(e) => setNewAssignment(a => ({ ...a, description: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Hướng dẫn chi tiết cho học viên..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                                        <select
                                            value={newAssignment.type}
                                            onChange={(e) => setNewAssignment(a => ({ ...a, type: e.target.value as Assignment['type'] }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="speaking">🎤 Speaking</option>
                                            <option value="writing">✍️ Writing</option>
                                            <option value="listening">🎧 Listening</option>
                                            <option value="vocabulary">📚 Vocabulary</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Độ khó</label>
                                        <select
                                            value={newAssignment.difficulty}
                                            onChange={(e) => setNewAssignment(a => ({ ...a, difficulty: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="A1">A1 - Beginner</option>
                                            <option value="A2">A2 - Elementary</option>
                                            <option value="B1">B1 - Intermediate</option>
                                            <option value="B2">B2 - Upper Intermediate</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Học viên</label>
                                        <select
                                            value={newAssignment.learner_id}
                                            onChange={(e) => setNewAssignment(a => ({ ...a, learner_id: Number(e.target.value) }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value={0}>Chọn học viên</option>
                                            {learners.map(l => (
                                                <option key={l.id} value={l.id}>{l.full_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hạn nộp</label>
                                        <input
                                            type="date"
                                            value={newAssignment.due_date}
                                            onChange={(e) => setNewAssignment(a => ({ ...a, due_date: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCreate(false)}
                                    className="flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleCreateAssignment}
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Giao bài
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MentorLayout>
    );
}
