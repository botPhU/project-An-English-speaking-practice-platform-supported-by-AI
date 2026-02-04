import { useState, useEffect } from 'react';
import LearnerLayout from '../../layouts/LearnerLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface Todo {
    id: number;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
    due_date?: string;
    is_completed: boolean;
    created_at: string;
}

export default function TodoList() {
    const { user } = useAuth();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [showAdd, setShowAdd] = useState(false);

    const [newTodo, setNewTodo] = useState({
        title: '',
        description: '',
        priority: 'medium' as const,
        category: 'study',
        due_date: ''
    });

    const categories = [
        { id: 'study', label: 'Học tập', icon: '📚' },
        { id: 'practice', label: 'Luyện tập', icon: '🎯' },
        { id: 'review', label: 'Ôn tập', icon: '📝' },
        { id: 'assignment', label: 'Bài tập', icon: '✏️' },
        { id: 'exam', label: 'Kiểm tra', icon: '📋' }
    ];

    useEffect(() => {
        if (user?.id) {
            fetchTodos();
        }
    }, [user?.id]);

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/todo?user_id=${user?.id}`);
            setTodos(response.data || []);
        } catch (error) {
            // Mock data
            setTodos([
                {
                    id: 1,
                    title: 'Hoàn thành bài Speaking về Travel',
                    description: 'Record 3-minute video about favorite destination',
                    priority: 'high',
                    category: 'assignment',
                    due_date: '2026-02-05',
                    is_completed: false,
                    created_at: '2026-02-01'
                },
                {
                    id: 2,
                    title: 'Ôn lại 50 từ vựng về Business',
                    priority: 'medium',
                    category: 'review',
                    is_completed: false,
                    created_at: '2026-02-01'
                },
                {
                    id: 3,
                    title: 'Luyện phát âm /θ/ và /ð/',
                    description: 'Think, this, that, weather, whether',
                    priority: 'medium',
                    category: 'practice',
                    is_completed: true,
                    created_at: '2026-01-28'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const toggleComplete = (todoId: number) => {
        setTodos(todos.map(t =>
            t.id === todoId ? { ...t, is_completed: !t.is_completed } : t
        ));
    };

    const deleteTodo = (todoId: number) => {
        setTodos(todos.filter(t => t.id !== todoId));
    };

    const addTodo = () => {
        if (!newTodo.title) return;

        const todo: Todo = {
            id: todos.length + 1,
            ...newTodo,
            is_completed: false,
            created_at: new Date().toISOString()
        };

        setTodos([todo, ...todos]);
        setShowAdd(false);
        setNewTodo({ title: '', description: '', priority: 'medium', category: 'study', due_date: '' });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'border-l-red-500 bg-red-50';
            case 'medium': return 'border-l-yellow-500 bg-yellow-50';
            case 'low': return 'border-l-green-500 bg-green-50';
            default: return 'border-l-gray-500';
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high': return { text: 'Cao', class: 'bg-red-100 text-red-700' };
            case 'medium': return { text: 'Trung bình', class: 'bg-yellow-100 text-yellow-700' };
            case 'low': return { text: 'Thấp', class: 'bg-green-100 text-green-700' };
            default: return { text: priority, class: 'bg-gray-100' };
        }
    };

    const filteredTodos = todos.filter(t => {
        if (filter === 'active') return !t.is_completed;
        if (filter === 'completed') return t.is_completed;
        return true;
    });

    const stats = {
        total: todos.length,
        completed: todos.filter(t => t.is_completed).length,
        active: todos.filter(t => !t.is_completed).length,
        highPriority: todos.filter(t => t.priority === 'high' && !t.is_completed).length
    };

    return (
        <LearnerLayout>
            <div className="max-w-3xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">✅ Danh sách Việc cần làm</h1>
                        <p className="text-gray-600">Quản lý công việc học tập của bạn</p>
                    </div>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                    >
                        ➕ Thêm mới
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="bg-white rounded-xl p-3 shadow text-center">
                        <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                        <p className="text-xs text-gray-500">Tổng</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow text-center">
                        <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
                        <p className="text-xs text-gray-500">Đang làm</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow text-center">
                        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                        <p className="text-xs text-gray-500">Hoàn thành</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow text-center">
                        <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
                        <p className="text-xs text-gray-500">Ưu tiên cao</p>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex gap-2 mb-4">
                    {[
                        { id: 'all', label: 'Tất cả' },
                        { id: 'active', label: 'Đang làm' },
                        { id: 'completed', label: 'Hoàn thành' }
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

                {/* Todo List */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : filteredTodos.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center shadow">
                            <span className="text-4xl">🎉</span>
                            <p className="mt-2 text-gray-500">
                                {filter === 'completed' ? 'Chưa có việc hoàn thành' :
                                    filter === 'active' ? 'Tất cả đã hoàn thành!' : 'Chưa có việc cần làm'}
                            </p>
                        </div>
                    ) : (
                        filteredTodos.map((todo) => (
                            <div
                                key={todo.id}
                                className={`bg-white rounded-xl p-4 shadow border-l-4 ${getPriorityColor(todo.priority)} ${todo.is_completed ? 'opacity-60' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <button
                                        onClick={() => toggleComplete(todo.id)}
                                        className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${todo.is_completed
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'border-gray-300 hover:border-green-500'
                                            }`}
                                    >
                                        {todo.is_completed && '✓'}
                                    </button>
                                    <div className="flex-1">
                                        <h3 className={`font-bold text-gray-800 ${todo.is_completed ? 'line-through' : ''}`}>
                                            {todo.title}
                                        </h3>
                                        {todo.description && (
                                            <p className="text-sm text-gray-500 mt-1">{todo.description}</p>
                                        )}
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`px-2 py-0.5 rounded text-xs ${getPriorityBadge(todo.priority).class}`}>
                                                {getPriorityBadge(todo.priority).text}
                                            </span>
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                                {categories.find(c => c.id === todo.category)?.icon}{' '}
                                                {categories.find(c => c.id === todo.category)?.label}
                                            </span>
                                            {todo.due_date && (
                                                <span className="text-xs text-gray-400">
                                                    📅 {todo.due_date}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Modal */}
                {showAdd && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">➕ Thêm việc mới</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Tiêu đề..."
                                    value={newTodo.title}
                                    onChange={(e) => setNewTodo(t => ({ ...t, title: e.target.value }))}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <textarea
                                    placeholder="Mô tả (tùy chọn)"
                                    value={newTodo.description}
                                    onChange={(e) => setNewTodo(t => ({ ...t, description: e.target.value }))}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={newTodo.priority}
                                        onChange={(e) => setNewTodo(t => ({ ...t, priority: e.target.value as Todo['priority'] }))}
                                        className="px-4 py-2 border rounded-lg"
                                    >
                                        <option value="low">🟢 Thấp</option>
                                        <option value="medium">🟡 Trung bình</option>
                                        <option value="high">🔴 Cao</option>
                                    </select>
                                    <select
                                        value={newTodo.category}
                                        onChange={(e) => setNewTodo(t => ({ ...t, category: e.target.value }))}
                                        className="px-4 py-2 border rounded-lg"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <input
                                    type="date"
                                    value={newTodo.due_date}
                                    onChange={(e) => setNewTodo(t => ({ ...t, due_date: e.target.value }))}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAdd(false)}
                                    className="flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={addTodo}
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </LearnerLayout>
    );
}
