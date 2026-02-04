import { useState, useEffect } from 'react';
import LearnerLayout from '../../layouts/LearnerLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface Note {
    id: number;
    title: string;
    content: string;
    category: string;
    tags: string[];
    created_at: string;
    updated_at: string;
}

export default function Notes() {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const [editForm, setEditForm] = useState({
        title: '',
        content: '',
        category: 'vocabulary',
        tags: ''
    });

    const categories = [
        { id: 'all', label: 'Tất cả', icon: '📚' },
        { id: 'vocabulary', label: 'Từ vựng', icon: '📖' },
        { id: 'grammar', label: 'Ngữ pháp', icon: '📝' },
        { id: 'pronunciation', label: 'Phát âm', icon: '🗣️' },
        { id: 'phrases', label: 'Cụm từ', icon: '💬' },
        { id: 'tips', label: 'Mẹo học', icon: '💡' }
    ];

    useEffect(() => {
        if (user?.id) {
            fetchNotes();
        }
    }, [user?.id]);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/notes/user/${user?.id}`);
            setNotes(response.data.notes || []);
        } catch (error) {
            // Mock data
            setNotes([
                {
                    id: 1,
                    title: 'Common Travel Vocabulary',
                    content: '**Airport:**\n- Boarding pass: Thẻ lên máy bay\n- Departure: Khởi hành\n- Arrival: Đến nơi\n- Gate: Cổng\n\n**Hotel:**\n- Check-in/Check-out\n- Room service\n- Amenities: Tiện nghi',
                    category: 'vocabulary',
                    tags: ['travel', 'airport', 'hotel'],
                    created_at: '2026-01-20T10:00:00',
                    updated_at: '2026-01-25T14:30:00'
                },
                {
                    id: 2,
                    title: 'Present Perfect vs Past Simple',
                    content: '**Present Perfect (have/has + V3):**\n- Action with result NOW\n- "I have lost my keys" (so I can\'t enter)\n\n**Past Simple (V2):**\n- Completed action\n- "I lost my keys yesterday" (finished event)',
                    category: 'grammar',
                    tags: ['tense', 'present perfect'],
                    created_at: '2026-01-18T09:00:00',
                    updated_at: '2026-01-18T09:00:00'
                },
                {
                    id: 3,
                    title: 'Difficult Words Pronunciation',
                    content: '1. **Comfortable** - COMF-ter-ble (3 syllables)\n2. **Vegetable** - VEJ-tuh-ble (3 syllables)\n3. **Entrepreneur** - on-truh-pruh-NUR\n4. **Recipe** - RE-suh-pee',
                    category: 'pronunciation',
                    tags: ['pronunciation', 'common mistakes'],
                    created_at: '2026-01-15T11:00:00',
                    updated_at: '2026-01-15T11:00:00'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = () => {
        setSelectedNote(null);
        setEditForm({ title: '', content: '', category: 'vocabulary', tags: '' });
        setIsEditing(true);
    };

    const handleEditNote = (note: Note) => {
        setSelectedNote(note);
        setEditForm({
            title: note.title,
            content: note.content,
            category: note.category,
            tags: note.tags.join(', ')
        });
        setIsEditing(true);
    };

    const handleSaveNote = () => {
        const newNote: Note = {
            id: selectedNote?.id || notes.length + 1,
            title: editForm.title,
            content: editForm.content,
            category: editForm.category,
            tags: editForm.tags.split(',').map(t => t.trim()).filter(t => t),
            created_at: selectedNote?.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        if (selectedNote) {
            setNotes(notes.map(n => n.id === selectedNote.id ? newNote : n));
        } else {
            setNotes([newNote, ...notes]);
        }

        setIsEditing(false);
        setSelectedNote(newNote);
    };

    const handleDeleteNote = (noteId: number) => {
        if (!confirm('Bạn có chắc muốn xóa ghi chú này?')) return;
        setNotes(notes.filter(n => n.id !== noteId));
        if (selectedNote?.id === noteId) setSelectedNote(null);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN');
    };

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <LearnerLayout>
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">📝 Ghi chú</h1>
                        <p className="text-gray-600">Lưu lại những kiến thức quan trọng</p>
                    </div>
                    <button
                        onClick={handleCreateNote}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                    >
                        ➕ Tạo ghi chú
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="🔍 Tìm kiếm ghi chú..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-3 py-2 rounded-lg text-sm transition ${selectedCategory === cat.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.icon}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Notes List */}
                    <div className="space-y-3">
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            </div>
                        ) : filteredNotes.length === 0 ? (
                            <div className="bg-white rounded-xl p-8 text-center shadow">
                                <span className="text-4xl">📭</span>
                                <p className="mt-2 text-gray-500">Chưa có ghi chú</p>
                            </div>
                        ) : (
                            filteredNotes.map((note) => (
                                <button
                                    key={note.id}
                                    onClick={() => { setSelectedNote(note); setIsEditing(false); }}
                                    className={`w-full text-left p-4 rounded-xl transition ${selectedNote?.id === note.id
                                            ? 'bg-blue-100 border-2 border-blue-500'
                                            : 'bg-white shadow hover:shadow-lg'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-800 line-clamp-1">{note.title}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{note.content}</p>
                                        </div>
                                        <span className="text-lg">
                                            {categories.find(c => c.id === note.category)?.icon}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        {note.tags.slice(0, 2).map((tag, idx) => (
                                            <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">{formatDate(note.updated_at)}</p>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Note Detail / Editor */}
                    <div className="md:col-span-2">
                        {isEditing ? (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    {selectedNote ? '✏️ Chỉnh sửa' : '➕ Ghi chú mới'}
                                </h2>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Tiêu đề..."
                                        value={editForm.title}
                                        onChange={(e) => setEditForm(f => ({ ...f, title: e.target.value }))}
                                        className="w-full px-4 py-2 border rounded-lg text-lg font-medium focus:ring-2 focus:ring-blue-500"
                                    />
                                    <select
                                        value={editForm.category}
                                        onChange={(e) => setEditForm(f => ({ ...f, category: e.target.value }))}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        {categories.filter(c => c.id !== 'all').map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                                        ))}
                                    </select>
                                    <textarea
                                        placeholder="Nội dung ghi chú... (hỗ trợ Markdown)"
                                        value={editForm.content}
                                        onChange={(e) => setEditForm(f => ({ ...f, content: e.target.value }))}
                                        className="w-full px-4 py-2 border rounded-lg h-64 focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tags (phân cách bằng dấu phẩy)"
                                        value={editForm.tags}
                                        onChange={(e) => setEditForm(f => ({ ...f, tags: e.target.value }))}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={handleSaveNote}
                                            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            💾 Lưu
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : selectedNote ? (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">{selectedNote.title}</h2>
                                        <p className="text-sm text-gray-500">
                                            {categories.find(c => c.id === selectedNote.category)?.icon}{' '}
                                            {categories.find(c => c.id === selectedNote.category)?.label} •{' '}
                                            Cập nhật: {formatDate(selectedNote.updated_at)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditNote(selectedNote)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDeleteNote(selectedNote.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                <div className="prose max-w-none">
                                    <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-gray-50 p-4 rounded-lg">
                                        {selectedNote.content}
                                    </pre>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    {selectedNote.tags.map((tag, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                                <span className="text-6xl">📝</span>
                                <p className="mt-4 text-gray-500">Chọn một ghi chú để xem hoặc tạo mới</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </LearnerLayout>
    );
}
