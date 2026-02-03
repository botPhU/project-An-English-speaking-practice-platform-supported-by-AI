import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';

interface LogEntry {
    id: number;
    timestamp: string;
    level: 'info' | 'warning' | 'error' | 'debug';
    source: string;
    message: string;
    user_id?: number;
    user_email?: string;
    ip_address?: string;
    details?: string;
}

export default function SystemLogs() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ level: 'all', source: 'all' });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

    const sources = ['auth', 'api', 'payment', 'session', 'admin', 'system'];

    useEffect(() => {
        fetchLogs();
    }, [filter]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/admin/logs');
            setLogs(response.data.logs || []);
        } catch (error) {
            // Mock data
            setLogs([
                {
                    id: 1,
                    timestamp: '2026-02-03T14:30:15',
                    level: 'info',
                    source: 'auth',
                    message: 'User login successful',
                    user_id: 101,
                    user_email: 'user@example.com',
                    ip_address: '192.168.1.100'
                },
                {
                    id: 2,
                    timestamp: '2026-02-03T14:28:45',
                    level: 'warning',
                    source: 'payment',
                    message: 'Payment retry attempted',
                    user_id: 102,
                    user_email: 'buyer@example.com',
                    details: 'Transaction ID: TXN123456 - Retry count: 2'
                },
                {
                    id: 3,
                    timestamp: '2026-02-03T14:25:30',
                    level: 'error',
                    source: 'api',
                    message: 'API rate limit exceeded',
                    ip_address: '10.0.0.55',
                    details: 'Endpoint: /api/chat - Requests: 105/min'
                },
                {
                    id: 4,
                    timestamp: '2026-02-03T14:20:00',
                    level: 'info',
                    source: 'session',
                    message: 'Speaking session completed',
                    user_id: 103,
                    details: 'Duration: 25 minutes, Topic: Business English'
                },
                {
                    id: 5,
                    timestamp: '2026-02-03T14:15:00',
                    level: 'info',
                    source: 'admin',
                    message: 'Resource published by admin',
                    user_id: 1,
                    user_email: 'admin@aesp.com',
                    details: 'Resource ID: 45 - Title: Grammar Basics'
                },
                {
                    id: 6,
                    timestamp: '2026-02-03T14:10:00',
                    level: 'error',
                    source: 'system',
                    message: 'Database connection timeout',
                    details: 'Pool: primary, Timeout: 30000ms'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'info': return 'bg-blue-100 text-blue-700';
            case 'warning': return 'bg-yellow-100 text-yellow-700';
            case 'error': return 'bg-red-100 text-red-700';
            case 'debug': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'info': return 'ℹ️';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            case 'debug': return '🔍';
            default: return '📋';
        }
    };

    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'auth': return '🔐';
            case 'api': return '🔌';
            case 'payment': return '💳';
            case 'session': return '🎓';
            case 'admin': return '👤';
            case 'system': return '⚙️';
            default: return '📋';
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        const matchesLevel = filter.level === 'all' || log.level === filter.level;
        const matchesSource = filter.source === 'all' || log.source === filter.source;
        return matchesSearch && matchesLevel && matchesSource;
    });

    const stats = {
        total: logs.length,
        info: logs.filter(l => l.level === 'info').length,
        warning: logs.filter(l => l.level === 'warning').length,
        error: logs.filter(l => l.level === 'error').length
    };

    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">📊 System Logs</h1>
                        <p className="text-gray-600">Theo dõi hoạt động hệ thống</p>
                    </div>
                    <button
                        onClick={fetchLogs}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        🔄 Làm mới
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-gray-700">{stats.total}</p>
                        <p className="text-sm text-gray-500">Tổng logs</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-blue-600">{stats.info}</p>
                        <p className="text-sm text-gray-500">ℹ️ Info</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-yellow-600">{stats.warning}</p>
                        <p className="text-sm text-gray-500">⚠️ Warning</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-red-600">{stats.error}</p>
                        <p className="text-sm text-gray-500">❌ Error</p>
                    </div>
                </div>

                {/* Filter */}
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
                            value={filter.level}
                            onChange={(e) => setFilter(f => ({ ...f, level: e.target.value }))}
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="all">Tất cả Level</option>
                            <option value="info">ℹ️ Info</option>
                            <option value="warning">⚠️ Warning</option>
                            <option value="error">❌ Error</option>
                            <option value="debug">🔍 Debug</option>
                        </select>
                        <select
                            value={filter.source}
                            onChange={(e) => setFilter(f => ({ ...f, source: e.target.value }))}
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="all">Tất cả Source</option>
                            {sources.map(s => (
                                <option key={s} value={s}>{getSourceIcon(s)} {s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Logs List */}
                    <div className="md:col-span-2 bg-white rounded-xl shadow overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                                {filteredLogs.map((log) => (
                                    <button
                                        key={log.id}
                                        onClick={() => setSelectedLog(log)}
                                        className={`w-full p-4 text-left hover:bg-gray-50 transition ${selectedLog?.id === log.id ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl">{getLevelIcon(log.level)}</span>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`px-2 py-0.5 rounded text-xs ${getLevelColor(log.level)}`}>
                                                        {log.level}
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                                        {getSourceIcon(log.source)} {log.source}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(log.timestamp).toLocaleString('vi-VN')}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-gray-800">{log.message}</p>
                                                {log.user_email && (
                                                    <p className="text-xs text-gray-500 mt-1">👤 {log.user_email}</p>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Detail Panel */}
                    <div className="bg-white rounded-xl shadow p-6">
                        {selectedLog ? (
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Chi tiết Log</h2>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-500">Thời gian</p>
                                        <p className="font-mono">{new Date(selectedLog.timestamp).toLocaleString('vi-VN')}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Level</p>
                                        <span className={`px-2 py-1 rounded ${getLevelColor(selectedLog.level)}`}>
                                            {getLevelIcon(selectedLog.level)} {selectedLog.level}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Source</p>
                                        <p>{getSourceIcon(selectedLog.source)} {selectedLog.source}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Message</p>
                                        <p className="p-2 bg-gray-50 rounded">{selectedLog.message}</p>
                                    </div>
                                    {selectedLog.user_email && (
                                        <div>
                                            <p className="text-gray-500">User</p>
                                            <p>{selectedLog.user_email} (ID: {selectedLog.user_id})</p>
                                        </div>
                                    )}
                                    {selectedLog.ip_address && (
                                        <div>
                                            <p className="text-gray-500">IP Address</p>
                                            <p className="font-mono">{selectedLog.ip_address}</p>
                                        </div>
                                    )}
                                    {selectedLog.details && (
                                        <div>
                                            <p className="text-gray-500">Details</p>
                                            <pre className="p-2 bg-gray-900 text-green-400 rounded text-xs overflow-x-auto">
                                                {selectedLog.details}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <span className="text-5xl">📋</span>
                                <p className="mt-4 text-gray-500">Chọn log để xem chi tiết</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
