/**
 * Resource Management Modal for Mentors
 * Create, upload and assign resources/exercises to learners
 */

import { useState, useEffect } from 'react';
import { resourceService, type Resource } from '../../services/resourceService';
import { assignmentService } from '../../services/assignmentService';

interface LearnerItem {
    id: number;
    learner_id: number;
    learner_name: string;
    learner_email: string;
    learner_avatar?: string | null;
}

interface ResourceModalProps {
    mentorId: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ResourceManagementModal({ mentorId, isOpen, onClose, onSuccess }: ResourceModalProps) {
    const [activeTab, setActiveTab] = useState<'create' | 'my-resources' | 'assign'>('create');
    const [resources, setResources] = useState<Resource[]>([]);
    const [learners, setLearners] = useState<LearnerItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state for creating resource
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        resource_type: 'document',
        file_url: '',
        category: 'vocabulary',
        difficulty_level: 'beginner',
        is_public: false
    });

    // Assignment state
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [selectedLearners, setSelectedLearners] = useState<number[]>([]);
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (isOpen && mentorId > 0) {
            fetchResources();
            fetchLearners();
        }
    }, [isOpen, mentorId]);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const response = await resourceService.getMentorResources(mentorId);
            setResources(response.data?.resources || []);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLearners = async () => {
        try {
            const data = await assignmentService.getMyLearner(mentorId);
            setLearners(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching learners:', error);
        }
    };

    const handleCreateResource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        try {
            setSubmitting(true);
            await resourceService.createResource({
                mentor_id: mentorId,
                ...formData
            });

            // Reset form
            setFormData({
                title: '',
                description: '',
                resource_type: 'document',
                file_url: '',
                category: 'vocabulary',
                difficulty_level: 'beginner',
                is_public: false
            });

            fetchResources();
            setActiveTab('my-resources');
            onSuccess?.();
        } catch (error) {
            console.error('Error creating resource:', error);
            alert('Có lỗi khi tạo tài liệu');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAssignResource = async () => {
        if (!selectedResource || selectedLearners.length === 0) {
            alert('Vui lòng chọn tài liệu và ít nhất một học viên');
            return;
        }

        try {
            setSubmitting(true);

            // Assign to each selected learner
            for (const learnerId of selectedLearners) {
                await resourceService.assignToLearner({
                    resource_id: selectedResource.id,
                    learner_id: learnerId,
                    mentor_id: mentorId,
                    due_date: dueDate || undefined
                });
            }

            alert(`Đã gán "${selectedResource.title}" cho ${selectedLearners.length} học viên`);
            setSelectedResource(null);
            setSelectedLearners([]);
            setDueDate('');
            onSuccess?.();
        } catch (error: any) {
            console.error('Error assigning resource:', error);
            alert(error.response?.data?.error || 'Có lỗi khi gán tài liệu');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteResource = async (resourceId: number) => {
        if (!confirm('Bạn có chắc muốn xóa tài liệu này?')) return;

        try {
            await resourceService.deleteResource(resourceId, mentorId);
            fetchResources();
        } catch (error) {
            console.error('Error deleting resource:', error);
            alert('Có lỗi khi xóa tài liệu');
        }
    };

    const toggleLearnerSelection = (learnerId: number) => {
        setSelectedLearners(prev =>
            prev.includes(learnerId)
                ? prev.filter(id => id !== learnerId)
                : [...prev, learnerId]
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a222a] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-[#3b4754]">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#3b4754]">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-2xl">library_books</span>
                        <h2 className="text-xl font-bold text-white">Quản lý Tài liệu & Bài tập</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#3b4754] rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined text-[#9dabb9]">close</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#3b4754]">
                    {[
                        { id: 'create', label: 'Tạo mới', icon: 'add_circle' },
                        { id: 'my-resources', label: 'Tài liệu của tôi', icon: 'folder' },
                        { id: 'assign', label: 'Gán cho học viên', icon: 'person_add' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-medium transition-colors ${activeTab === tab.id
                                ? 'text-primary border-b-2 border-primary bg-primary/10'
                                : 'text-[#9dabb9] hover:text-white hover:bg-[#3b4754]/30'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* Create Resource Tab */}
                    {activeTab === 'create' && (
                        <form onSubmit={handleCreateResource} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#9dabb9] mb-1">Tiêu đề *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#283039] border border-[#3b4754] rounded-lg text-white focus:outline-none focus:border-primary"
                                        placeholder="Nhập tiêu đề tài liệu"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#9dabb9] mb-1">Loại tài liệu</label>
                                    <select
                                        value={formData.resource_type}
                                        onChange={e => setFormData({ ...formData, resource_type: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#283039] border border-[#3b4754] rounded-lg text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="document">Tài liệu</option>
                                        <option value="exercise">Bài tập</option>
                                        <option value="video">Video</option>
                                        <option value="audio">Audio</option>
                                        <option value="link">Link</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#9dabb9] mb-1">Chủ đề</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#283039] border border-[#3b4754] rounded-lg text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="vocabulary">Từ vựng</option>
                                        <option value="grammar">Ngữ pháp</option>
                                        <option value="pronunciation">Phát âm</option>
                                        <option value="speaking">Nói</option>
                                        <option value="listening">Nghe</option>
                                        <option value="reading">Đọc</option>
                                        <option value="writing">Viết</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#9dabb9] mb-1">Độ khó</label>
                                    <select
                                        value={formData.difficulty_level}
                                        onChange={e => setFormData({ ...formData, difficulty_level: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#283039] border border-[#3b4754] rounded-lg text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="beginner">Cơ bản</option>
                                        <option value="intermediate">Trung cấp</option>
                                        <option value="advanced">Nâng cao</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#9dabb9] mb-1">Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-[#283039] border border-[#3b4754] rounded-lg text-white focus:outline-none focus:border-primary resize-none"
                                    placeholder="Mô tả chi tiết về tài liệu..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#9dabb9] mb-1">Link tài liệu</label>
                                <input
                                    type="url"
                                    value={formData.file_url}
                                    onChange={e => setFormData({ ...formData, file_url: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#283039] border border-[#3b4754] rounded-lg text-white focus:outline-none focus:border-primary"
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_public"
                                    checked={formData.is_public}
                                    onChange={e => setFormData({ ...formData, is_public: e.target.checked })}
                                    className="w-4 h-4 accent-primary"
                                />
                                <label htmlFor="is_public" className="text-[#9dabb9]">
                                    Công khai (tất cả học viên có thể xem)
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || !formData.title.trim()}
                                className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">add</span>
                                        Tạo tài liệu
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* My Resources Tab */}
                    {activeTab === 'my-resources' && (
                        <div className="space-y-3">
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                                </div>
                            ) : resources.length === 0 ? (
                                <div className="text-center py-8">
                                    <span className="material-symbols-outlined text-5xl text-[#3b4754] mb-2 block">folder_open</span>
                                    <p className="text-[#9dabb9]">Chưa có tài liệu nào</p>
                                    <button
                                        onClick={() => setActiveTab('create')}
                                        className="mt-3 text-primary hover:underline"
                                    >
                                        Tạo tài liệu đầu tiên →
                                    </button>
                                </div>
                            ) : (
                                resources.map(resource => (
                                    <div
                                        key={resource.id}
                                        className="flex items-center justify-between p-4 bg-[#283039] rounded-xl border border-[#3b4754] hover:border-primary/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`size-12 rounded-lg flex items-center justify-center ${resource.resource_type === 'exercise' ? 'bg-purple-500/20 text-purple-400' :
                                                resource.resource_type === 'video' ? 'bg-red-500/20 text-red-400' :
                                                    resource.resource_type === 'audio' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                <span className="material-symbols-outlined text-2xl">
                                                    {resource.resource_type === 'exercise' ? 'assignment' :
                                                        resource.resource_type === 'video' ? 'play_circle' :
                                                            resource.resource_type === 'audio' ? 'headphones' :
                                                                'description'}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{resource.title}</h4>
                                                <div className="flex items-center gap-2 text-xs text-[#9dabb9] mt-1">
                                                    <span className="px-2 py-0.5 bg-[#3b4754] rounded">{resource.category}</span>
                                                    <span className="px-2 py-0.5 bg-[#3b4754] rounded">{resource.difficulty_level}</span>
                                                    {resource.is_public && (
                                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded">Công khai</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedResource(resource);
                                                    setActiveTab('assign');
                                                }}
                                                className="p-2 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                                                title="Gán cho học viên"
                                            >
                                                <span className="material-symbols-outlined">person_add</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteResource(resource.id)}
                                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                title="Xóa"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Assign Tab */}
                    {activeTab === 'assign' && (
                        <div className="space-y-4">
                            {/* Select Resource */}
                            <div>
                                <label className="block text-sm font-medium text-[#9dabb9] mb-2">Chọn tài liệu</label>
                                {resources.length === 0 ? (
                                    <div className="p-4 bg-[#283039] rounded-lg text-center text-[#9dabb9]">
                                        Chưa có tài liệu. <button onClick={() => setActiveTab('create')} className="text-primary">Tạo ngay</button>
                                    </div>
                                ) : (
                                    <select
                                        value={selectedResource?.id || ''}
                                        onChange={e => {
                                            const res = resources.find(r => r.id === Number(e.target.value));
                                            setSelectedResource(res || null);
                                        }}
                                        className="w-full px-4 py-3 bg-[#283039] border border-[#3b4754] rounded-lg text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="">-- Chọn tài liệu --</option>
                                        {resources.map(r => (
                                            <option key={r.id} value={r.id}>{r.title} ({r.resource_type})</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Select Learners */}
                            <div>
                                <label className="block text-sm font-medium text-[#9dabb9] mb-2">
                                    Chọn học viên ({selectedLearners.length} đã chọn)
                                </label>
                                {learners.length === 0 ? (
                                    <div className="p-4 bg-[#283039] rounded-lg text-center text-[#9dabb9]">
                                        Chưa có học viên được gán
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                        {learners.map(learner => (
                                            <div
                                                key={learner.learner_id}
                                                onClick={() => toggleLearnerSelection(learner.learner_id)}
                                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedLearners.includes(learner.learner_id)
                                                    ? 'bg-primary/20 border-2 border-primary'
                                                    : 'bg-[#283039] border-2 border-transparent hover:border-[#3b4754]'
                                                    }`}
                                            >
                                                {learner.learner_avatar ? (
                                                    <img
                                                        src={learner.learner_avatar}
                                                        alt={learner.learner_name}
                                                        className="size-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                        {learner.learner_name?.charAt(0).toUpperCase() || 'H'}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-white truncate">{learner.learner_name}</p>
                                                    <p className="text-xs text-[#9dabb9] truncate">{learner.learner_email}</p>
                                                </div>
                                                {selectedLearners.includes(learner.learner_id) && (
                                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="block text-sm font-medium text-[#9dabb9] mb-1">
                                    Hạn nộp (tùy chọn)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={dueDate}
                                    onChange={e => setDueDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#283039] border border-[#3b4754] rounded-lg text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            {/* Assign Button */}
                            <button
                                onClick={handleAssignResource}
                                disabled={submitting || !selectedResource || selectedLearners.length === 0}
                                className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">send</span>
                                        Gán tài liệu cho {selectedLearners.length} học viên
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
