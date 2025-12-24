import { useState } from 'react';

// Mock data for mentors
const mockMentors = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', specialty: 'Business English', rating: 4.8, status: 'active', students: 45 },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', specialty: 'IELTS Speaking', rating: 4.9, status: 'active', students: 62 },
    { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', specialty: 'Daily Conversation', rating: 4.5, status: 'inactive', students: 28 },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', specialty: 'Academic English', rating: 4.7, status: 'active', students: 51 },
];

export default function MentorManagement() {
    const [mentors] = useState(mockMentors);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedMentor, setSelectedMentor] = useState<typeof mockMentors[0] | null>(null);

    const filteredMentors = mentors.filter(mentor => {
        const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mentor.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || mentor.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#111418] p-6 font-[Manrope,sans-serif]">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#111418] dark:text-white mb-2">
                    Quản Lý Mentor
                </h1>
                <p className="text-[#637588] dark:text-[#9dabb9]">
                    Quản lý danh sách và thông tin chi tiết của các Mentor trong hệ thống
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-[#2b8cee]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#2b8cee]">groups</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">{mentors.length}</p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Tổng Mentor</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">
                                {mentors.filter(m => m.status === 'active').length}
                            </p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Đang hoạt động</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-yellow-500">star</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">
                                {(mentors.reduce((sum, m) => sum + m.rating, 0) / mentors.length).toFixed(1)}
                            </p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Rating TB</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-purple-500">school</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">
                                {mentors.reduce((sum, m) => sum + m.students, 0)}
                            </p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Tổng học viên</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-white dark:bg-[#1c2127] rounded-xl p-4 mb-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#637588]">search</span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên hoặc email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#dce0e5] dark:border-[#3b4754] bg-[#f6f7f8] dark:bg-[#111418] text-[#111418] dark:text-white placeholder:text-[#9dabb9] focus:ring-2 focus:ring-[#2b8cee]/50 focus:border-[#2b8cee] transition-all"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3 rounded-lg border border-[#dce0e5] dark:border-[#3b4754] bg-[#f6f7f8] dark:bg-[#111418] text-[#111418] dark:text-white focus:ring-2 focus:ring-[#2b8cee]/50"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </select>
                    <button className="px-6 py-3 bg-[#2b8cee] hover:bg-[#2b8cee]/90 text-white font-bold rounded-lg transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined">add</span>
                        Thêm Mentor
                    </button>
                </div>
            </div>

            {/* Mentors Table */}
            <div className="bg-white dark:bg-[#1c2127] rounded-xl shadow-sm border border-[#dce0e5] dark:border-[#3b4754] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#f6f7f8] dark:bg-[#111418] border-b border-[#dce0e5] dark:border-[#3b4754]">
                            <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Mentor</th>
                            <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Chuyên môn</th>
                            <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Rating</th>
                            <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Học viên</th>
                            <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Trạng thái</th>
                            <th className="text-right px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMentors.map((mentor) => (
                            <tr key={mentor.id} className="border-b border-[#dce0e5] dark:border-[#3b4754] hover:bg-[#f6f7f8] dark:hover:bg-[#111418]/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-gradient-to-br from-[#2b8cee] to-purple-500 flex items-center justify-center text-white font-bold">
                                            {mentor.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#111418] dark:text-white">{mentor.name}</p>
                                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">{mentor.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-[#2b8cee]/10 text-[#2b8cee] text-sm font-medium">
                                        {mentor.specialty}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-yellow-500 text-[18px]">star</span>
                                        <span className="font-semibold text-[#111418] dark:text-white">{mentor.rating}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[#111418] dark:text-white font-medium">{mentor.students}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${mentor.status === 'active'
                                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                            : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {mentor.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setSelectedMentor(mentor)}
                                            className="p-2 hover:bg-[#2b8cee]/10 rounded-lg transition-colors text-[#637588] hover:text-[#2b8cee]"
                                        >
                                            <span className="material-symbols-outlined">visibility</span>
                                        </button>
                                        <button className="p-2 hover:bg-[#2b8cee]/10 rounded-lg transition-colors text-[#637588] hover:text-[#2b8cee]">
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                        <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-[#637588] hover:text-red-500">
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mentor Detail Modal */}
            {selectedMentor && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-[#1c2127] rounded-2xl max-w-lg w-full p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-[#111418] dark:text-white">Chi tiết Mentor</h2>
                            <button
                                onClick={() => setSelectedMentor(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-[#111418] rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-[#637588]">close</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-16 rounded-full bg-gradient-to-br from-[#2b8cee] to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                                {selectedMentor.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#111418] dark:text-white">{selectedMentor.name}</h3>
                                <p className="text-[#637588] dark:text-[#9dabb9]">{selectedMentor.email}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between py-3 border-b border-[#dce0e5] dark:border-[#3b4754]">
                                <span className="text-[#637588] dark:text-[#9dabb9]">Chuyên môn</span>
                                <span className="font-semibold text-[#111418] dark:text-white">{selectedMentor.specialty}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-[#dce0e5] dark:border-[#3b4754]">
                                <span className="text-[#637588] dark:text-[#9dabb9]">Rating</span>
                                <span className="font-semibold text-[#111418] dark:text-white flex items-center gap-1">
                                    <span className="material-symbols-outlined text-yellow-500 text-[18px]">star</span>
                                    {selectedMentor.rating}
                                </span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-[#dce0e5] dark:border-[#3b4754]">
                                <span className="text-[#637588] dark:text-[#9dabb9]">Số học viên</span>
                                <span className="font-semibold text-[#111418] dark:text-white">{selectedMentor.students}</span>
                            </div>
                            <div className="flex justify-between py-3">
                                <span className="text-[#637588] dark:text-[#9dabb9]">Trạng thái</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedMentor.status === 'active'
                                        ? 'bg-green-500/10 text-green-600'
                                        : 'bg-gray-500/10 text-gray-600'
                                    }`}>
                                    {selectedMentor.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button className="flex-1 py-3 border border-[#dce0e5] dark:border-[#3b4754] rounded-lg font-bold text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-[#111418] transition-colors">
                                {selectedMentor.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                            </button>
                            <button className="flex-1 py-3 bg-[#2b8cee] text-white rounded-lg font-bold hover:bg-[#2b8cee]/90 transition-colors">
                                Chỉnh sửa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
