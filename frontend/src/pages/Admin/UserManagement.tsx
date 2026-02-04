import React, { useState, useEffect, useCallback, memo } from 'react';
import { AdminLayout } from '../../components/layout';
import { adminService } from '../../services/adminService';
import { useWebSocket } from '../../hooks/useWebSocket';
import type { WebSocketMessage, OnlineStatus, UserStatusChangePayload } from '../../types/websocket';

// Socket.IO configuration - connects to Flask-SocketIO backend
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

// Types
interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'learner' | 'mentor' | 'admin';
    lastActive: string;
    package: string;
    status: boolean;
    onlineStatus: OnlineStatus; // Real-time online status from WebSocket
}

// Memoized UserRow component to prevent unnecessary re-renders
interface UserRowProps {
    user: User;
    onToggleStatus: (userId: string) => void;
    getRoleBadge: (role: User['role']) => React.ReactNode;
    getInitials: (name: string) => string;
}

const UserRow = memo(({ user, onToggleStatus, getRoleBadge, getInitials }: UserRowProps) => {
    return (
        <tr className="group hover:bg-[#283039] transition-colors">
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        {user.avatar ? (
                            <div
                                className="size-10 rounded-full bg-cover bg-center bg-gray-600"
                                style={{ backgroundImage: `url("${user.avatar}")` }}
                            />
                        ) : (
                            <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                                {getInitials(user.name)}
                            </div>
                        )}
                        {/* Online Status Indicator */}
                        <span
                            className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#1a222a] transition-all duration-300 ${user.onlineStatus === 'online'
                                ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                                : user.onlineStatus === 'away'
                                    ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]'
                                    : 'bg-gray-500'
                                }`}
                            title={user.onlineStatus === 'online' ? 'Đang hoạt động' : user.onlineStatus === 'away' ? 'Vắng mặt' : 'Ngoại tuyến'}
                        />
                    </div>
                    <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-xs text-[#9dabb9]">{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="p-4">{getRoleBadge(user.role)}</td>
            <td className="p-4 text-[#9dabb9]">{user.package}</td>
            <td className="p-4 text-[#9dabb9]">{user.lastActive}</td>
            <td className="p-4">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={user.status}
                        onChange={() => onToggleStatus(user.id)}
                    />
                    <div className="w-11 h-6 bg-[#3b4754] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </td>
            <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors"
                        title="Xem chi tiết"
                    >
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button
                        className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors"
                        title="Chỉnh sửa"
                    >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                        className="p-1.5 hover:bg-red-500/20 text-[#9dabb9] hover:text-red-500 rounded-lg transition-colors"
                        title="Xóa"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    );
});

interface UserStats {
    totalUsers: { count: number; change: string };
    activeLearners: { count: number; change: string };
    teachers: { count: number; change: string };
}

type RoleFilter = 'all' | 'learner' | 'mentor';
type StatusFilter = 'all' | 'active' | 'inactive';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    // WebSocket message handler - memoized to prevent unnecessary reconnections
    const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
        console.log('[UserManagement] Received WebSocket message:', message);

        if (message.type === 'USER_STATUS_CHANGE') {
            const { userId, status, lastActive } = message.payload as UserStatusChangePayload;
            const userIdStr = String(userId);

            console.log(`[UserManagement] User ${userIdStr} status changed to: ${status}`);

            // Functional update - only updates the specific user, minimizing re-renders
            setUsers(prevUsers => {
                const updatedUsers = prevUsers.map(user =>
                    String(user.id) === userIdStr
                        ? {
                            ...user,
                            onlineStatus: status,
                            lastActive: lastActive || user.lastActive
                        }
                        : user
                );

                const foundUser = updatedUsers.find(u => String(u.id) === userIdStr);
                console.log(`[UserManagement] User found: ${foundUser?.name || 'NOT FOUND'}, new status: ${foundUser?.onlineStatus}`);

                return updatedUsers;
            });
        }
    }, []);

    // WebSocket connection
    const { isConnected, connectionState } = useWebSocket({
        url: WS_URL,
        onMessage: handleWebSocketMessage,
        autoConnect: true,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersResponse, statsResponse] = await Promise.all([
                adminService.getUsers(),
                adminService.getUserStats()
            ]);

            // Map API response to component format
            const mappedUsers = (usersResponse.data.users || usersResponse.data || []).map((user: any) => ({
                id: user.id?.toString() || user.user_id?.toString(),
                name: user.name || user.full_name || user.user_name,
                email: user.email,
                avatar: user.avatar || user.profile_picture,
                role: user.role || 'learner',
                lastActive: user.last_active || user.lastActive || 'N/A',
                package: user.package || user.subscription_plan || '--',
                status: user.status === 'active' || user.is_active !== false,
                onlineStatus: (user.online_status || user.onlineStatus || 'offline') as OnlineStatus
            }));

            setUsers(mappedUsers);

            // Map stats response
            const apiStats = statsResponse.data;
            setStats({
                totalUsers: { count: apiStats.total_users || apiStats.totalUsers || 0, change: apiStats.users_change || '+0%' },
                activeLearners: { count: apiStats.active_learners || apiStats.activeLearners || 0, change: apiStats.learners_change || '+0%' },
                teachers: { count: apiStats.total_mentors || apiStats.teachers || 0, change: apiStats.mentors_change || '+0%' }
            });

            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Không thể tải danh sách người dùng');
            // Set empty stats instead of mock data
            setStats({
                totalUsers: { count: 0, change: 'Chưa có dữ liệu' },
                activeLearners: { count: 0, change: 'Chưa có dữ liệu' },
                teachers: { count: 0, change: 'Chưa có dữ liệu' }
            });
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter users based on search and filters
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && user.status) ||
            (statusFilter === 'inactive' && !user.status);

        return matchesSearch && matchesRole && matchesStatus;
    });

    // Memoized toggle handler for UserRow
    const toggleUserStatus = useCallback(async (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        try {
            if (user.status) {
                await adminService.disableUser(userId);
            } else {
                await adminService.enableUser(userId);
            }

            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, status: !u.status } : u
            ));
        } catch (err) {
            console.error('Error toggling user status:', err);
        }
    }, [users]);

    // Memoized helper functions for UserRow
    const getInitialsMemo = useCallback((name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }, []);

    const getRoleBadgeMemo = useCallback((role: User['role']) => {
        switch (role) {
            case 'learner':
                return (
                    <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/30">
                        Người học
                    </span>
                );
            case 'mentor':
                return (
                    <span className="inline-flex items-center rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-500/30">
                        Giảng viên
                    </span>
                );
            default:
                return null;
        }
    }, []);


    return (
        <AdminLayout
            title="Quản Lý Người Dùng"
            subtitle="Quản lý tài khoản người học và giáo viên"
            icon="group"
            actions={
                <div className="flex items-center gap-3">
                    {/* WebSocket Connection Status */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${isConnected
                        ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/30'
                        : connectionState === 'reconnecting'
                            ? 'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/30 animate-pulse'
                            : 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30'
                        }`}>
                        <span className={`size-2 rounded-full ${isConnected ? 'bg-green-500' : connectionState === 'reconnecting' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                        {isConnected ? 'Realtime' : connectionState === 'reconnecting' ? 'Đang kết nối...' : 'Offline'}
                    </div>
                    <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/25 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">person_add</span>
                        Thêm người dùng
                    </button>
                </div>
            }
        >
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Tổng người dùng</p>
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-md text-[20px]">
                                groups
                            </span>
                        </div>
                        {loading ? (
                            <div className="h-9 w-20 bg-[#3e4854] animate-pulse rounded"></div>
                        ) : (
                            <>
                                <p className="text-white tracking-tight text-3xl font-bold">{stats?.totalUsers.count.toLocaleString()}</p>
                                <div className="flex items-center gap-1 text-[#0bda5b] text-xs font-medium">
                                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                                    <span>{stats?.totalUsers.change} tháng này</span>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Người học hoạt động</p>
                            <span className="material-symbols-outlined text-[#0bda5b] bg-[#0bda5b]/10 p-1 rounded-md text-[20px]">
                                school
                            </span>
                        </div>
                        {loading ? (
                            <div className="h-9 w-20 bg-[#3e4854] animate-pulse rounded"></div>
                        ) : (
                            <>
                                <p className="text-white tracking-tight text-3xl font-bold">{stats?.activeLearners.count.toLocaleString()}</p>
                                <div className="flex items-center gap-1 text-[#0bda5b] text-xs font-medium">
                                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                                    <span>{stats?.activeLearners.change} tháng này</span>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Giáo viên</p>
                            <span className="material-symbols-outlined text-purple-400 bg-purple-400/10 p-1 rounded-md text-[20px]">
                                supervisor_account
                            </span>
                        </div>
                        {loading ? (
                            <div className="h-9 w-20 bg-[#3e4854] animate-pulse rounded"></div>
                        ) : (
                            <>
                                <p className="text-white tracking-tight text-3xl font-bold">{stats?.teachers.count}</p>
                                <div className="flex items-center gap-1 text-[#0bda5b] text-xs font-medium">
                                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                                    <span>{stats?.teachers.change} tháng này</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between bg-[#283039]/50 p-4 rounded-xl border border-[#3b4754]">
                    <div className="flex flex-1 w-full gap-4 flex-col md:flex-row">
                        <div className="relative flex-1 min-w-[240px]">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9dabb9]">
                                search
                            </span>
                            <input
                                type="text"
                                className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-[#9dabb9]/60"
                                placeholder="Tìm kiếm tên hoặc email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="relative w-full md:w-40">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9dabb9]">
                                badge
                            </span>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
                                className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg pl-11 pr-8 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                            >
                                <option value="all">Tất cả</option>
                                <option value="learner">Người học</option>
                                <option value="mentor">Giảng viên</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] pointer-events-none text-sm">
                                expand_more
                            </span>
                        </div>
                        <div className="relative w-full md:w-40">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9dabb9]">
                                filter_list
                            </span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                                className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg pl-11 pr-8 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Vô hiệu hóa</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] pointer-events-none text-sm">
                                expand_more
                            </span>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="rounded-xl border border-[#3b4754] bg-[#1a222a] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#283039] border-b border-[#3b4754]">
                                <tr>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Người dùng</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Vai trò</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Gói dịch vụ</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Hoạt động cuối</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Trạng thái</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#3b4754]">
                                {loading ? (
                                    // Loading skeleton
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i}>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-[#3e4854] animate-pulse"></div>
                                                    <div className="space-y-2">
                                                        <div className="h-4 w-32 bg-[#3e4854] animate-pulse rounded"></div>
                                                        <div className="h-3 w-40 bg-[#3e4854] animate-pulse rounded"></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4"><div className="h-6 w-20 bg-[#3e4854] animate-pulse rounded-full"></div></td>
                                            <td className="p-4"><div className="h-4 w-16 bg-[#3e4854] animate-pulse rounded"></div></td>
                                            <td className="p-4"><div className="h-4 w-24 bg-[#3e4854] animate-pulse rounded"></div></td>
                                            <td className="p-4"><div className="h-6 w-12 bg-[#3e4854] animate-pulse rounded-full"></div></td>
                                            <td className="p-4"><div className="h-8 w-20 bg-[#3e4854] animate-pulse rounded ml-auto"></div></td>
                                        </tr>
                                    ))
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-[#9dabb9]">
                                            {error || 'Không tìm thấy người dùng nào'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <UserRow
                                            key={user.id}
                                            user={user}
                                            onToggleStatus={toggleUserStatus}
                                            getRoleBadge={getRoleBadgeMemo}
                                            getInitials={getInitialsMemo}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-[#3b4754] bg-[#1a222a] px-4 py-3 sm:px-6">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-[#9dabb9]">
                                    Hiển thị <span className="font-medium text-white">1</span> đến{' '}
                                    <span className="font-medium text-white">{filteredUsers.length}</span> của{' '}
                                    <span className="font-medium text-white">{users.length}</span> kết quả
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                    <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-[#9dabb9] ring-1 ring-inset ring-[#3b4754] hover:bg-[#283039]">
                                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                    </button>
                                    <button className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white">
                                        1
                                    </button>
                                    <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-[#9dabb9] ring-1 ring-inset ring-[#3b4754] hover:bg-[#283039]">
                                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserManagement;
