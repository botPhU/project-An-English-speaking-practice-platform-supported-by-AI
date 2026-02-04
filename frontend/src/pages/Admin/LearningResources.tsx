import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';

interface LearningResource {
    id: number;
    title: string;
    description: string;
    type: 'video' | 'document' | 'audio' | 'link' | 'quiz';
    category: string;
    level: string;
    url?: string;
    file_path?: string;
    duration?: number;
    views: number;
    is_published: boolean;
    created_at: string;
    created_by: string;
}

export default function LearningResources() {
    const [resources, setResources] = useState<LearningResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ type: 'all', category: 'all', level: 'all' });
    const [showCreate, setShowCreate] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [newResource, setNewResource] = useState({
        title: '',
        description: '',
        type: 'video' as const,
        category: 'grammar',
        level: 'A2',
        url: '',
        duration: 0
    });

    const categories = ['grammar', 'vocabulary', 'pronunciation', 'speaking', 'listening', 'reading', 'writing'];
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const types = [
        { id: 'video', label: 'Video', icon: '🎬' },
        { id: 'document', label: 'Tài liệu', icon: '📄' },
        { id: 'audio', label: 'Audio', icon: '🎧' },
        { id: 'link', label: 'Liên kết', icon: '🔗' },
        { id: 'quiz', label: 'Quiz', icon: '❓' }
    ];

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/resources');
            setResources(response.data.resources || []);
        } catch (error) {
            // Mock data
            setResources([
                {
                    id: 1,
                    title: 'Present Perfect Tense Explained',
                    description: 'Hướng dẫn chi tiết về thì hiện tại hoàn thành',
                    type: 'video',
                    category: 'grammar',
                    level: 'A2',
                    url: 'https://youtube.com/...',
                    duration: 15,
                    views: 1250,
                    is_published: true,
                    created_at: '2026-01-15',
                    created_by: 'Admin'
                },
                {
                    id: 2,
                    title: '500 Essential English Words',
                    description: 'Từ vựng cơ bản cho người mới bắt đầu',
                    type: 'document',
                    category: 'vocabulary',
                    level: 'A1',
                    file_path: '/files/500words.pdf',
                    views: 890,
                    is_published: true,
                    created_at: '2026-01-10',
                    created_by: 'Admin'
                },
                {
                    id: 3,
                    title: 'Pronunciation Practice - TH Sound',
                    description: 'Luyện phát âm /θ/ và /ð/',
                    type: 'audio',
                    category: 'pronunciation',
                    level: 'B1',
                    url: '/audio/th-sound.mp3',
                    duration: 8,
                    views: 567,
                    is_published: true,
                    created_at: '2026-01-20',
                    created_by: 'Admin'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type: string) => {
        return types.find(t => t.id === type)?.icon || '📄';
    };

    const togglePublish = (id: number) => {
        setResources(resources.map(r =>
            r.id === id ? { ...r, is_published: !r.is_published } : r
        ));
    };

    const deleteResource = (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa tài liệu này?')) return;
        setResources(resources.filter(r => r.id !== id));
    };

    const handleCreate = () => {
        const resource: LearningResource = {
            id: resources.length + 1,
            ...newResource,
            views: 0,
            is_published: false,
            created_at: new Date().toISOString().split('T')[0],
            created_by: 'Admin'
        };
        setResources([resource, ...resources]);
        setShowCreate(false);
        setNewResource({ title: '', description: '', type: 'video', category: 'grammar', level: 'A2', url: '', duration: 0 });
    };

    const filteredResources = resources.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filter.type === 'all' || r.type === filter.type;
        const matchesCategory = filter.category === 'all' || r.category === filter.category;
        const matchesLevel = filter.level === 'all' || r.level === filter.level;
        return matchesSearch && matchesType && matchesCategory && matchesLevel;
    });

    const stats = {
        total: resources.length,
        published: resources.filter(r => r.is_published).length,
        totalViews: resources.reduce((sum, r) => sum + r.views, 0)
    };

    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">📚 Quản lý Tài liệu học tập</h1>
                        <p className="text-gray-600">Thêm và quản lý tài liệu cho học viên</p>
                    </div>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        ➕ Thêm tài liệu
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                        <p className="text-sm text-gray-500">Tổng tài liệu</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-green-600">{stats.published}</p>
                        <p className="text-sm text-gray-500">Đã xuất bản</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Lượt xem</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="bg-white rounded-xl p-4 shadow mb-6">
                    <div className="flex flex-wrap gap-4">
                        <input
                            type="text"
                            placeholder="🔍 Tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-lg"
                        />
                        <select
                            value={filter.type}
                            onChange={(e) => setFilter(f => ({ ...f, type: e.target.value }))}
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="all">Tất cả loại</option>
                            {types.map(t => (
                                <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
                            ))}
                        </select>
                        <select
                            value={filter.category}
                            onChange={(e) => setFilter(f => ({ ...f, category: e.target.value }))}
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="all">Tất cả danh mục</option>
                            {categories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <select
                            value={filter.level}
                            onChange={(e) => setFilter(f => ({ ...f, level: e.target.value }))}
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="all">Tất cả level</option>
                            {levels.map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Resource List */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tài liệu</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Loại</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Level</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Lượt xem</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Trạng thái</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredResources.map((resource) => (
                                    <tr key={resource.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                                                <div>
                                                    <p className="font-medium text-gray-800">{resource.title}</p>
                                                    <p className="text-sm text-gray-500">{resource.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-sm">{resource.type}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">{resource.level}</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{resource.views.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => togglePublish(resource.id)}
                                                className={`px-3 py-1 rounded text-sm ${resource.is_published
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                {resource.is_published ? '✓ Đã xuất bản' : 'Bản nháp'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">✏️</button>
                                                <button
                                                    onClick={() => deleteResource(resource.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Create Modal */}
                {showCreate && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">➕ Thêm tài liệu mới</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Tiêu đề"
                                    value={newResource.title}
                                    onChange={(e) => setNewResource(r => ({ ...r, title: e.target.value }))}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                                <textarea
                                    placeholder="Mô tả"
                                    value={newResource.description}
                                    onChange={(e) => setNewResource(r => ({ ...r, description: e.target.value }))}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    rows={3}
                                />
                                <div className="grid grid-cols-3 gap-4">
                                    <select
                                        value={newResource.type}
                                        onChange={(e) => setNewResource(r => ({ ...r, type: e.target.value as LearningResource['type'] }))}
                                        className="px-4 py-2 border rounded-lg"
                                    >
                                        {types.map(t => (
                                            <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={newResource.category}
                                        onChange={(e) => setNewResource(r => ({ ...r, category: e.target.value }))}
                                        className="px-4 py-2 border rounded-lg"
                                    >
                                        {categories.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={newResource.level}
                                        onChange={(e) => setNewResource(r => ({ ...r, level: e.target.value }))}
                                        className="px-4 py-2 border rounded-lg"
                                    >
                                        {levels.map(l => (
                                            <option key={l} value={l}>{l}</option>
                                        ))}
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    placeholder="URL hoặc đường dẫn file"
                                    value={newResource.url}
                                    onChange={(e) => setNewResource(r => ({ ...r, url: e.target.value }))}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCreate(false)}
                                    className="flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
