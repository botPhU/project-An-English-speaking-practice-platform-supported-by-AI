import { useState } from 'react';

// Mock data for policies
const mockPolicies = [
    { id: 1, title: 'Điều khoản sử dụng', slug: 'terms-of-service', status: 'published', lastUpdated: '2024-12-15', version: '2.1' },
    { id: 2, title: 'Chính sách bảo mật', slug: 'privacy-policy', status: 'published', lastUpdated: '2024-12-10', version: '1.5' },
    { id: 3, title: 'Chính sách hoàn tiền', slug: 'refund-policy', status: 'draft', lastUpdated: '2024-12-20', version: '1.0' },
    { id: 4, title: 'Quy tắc cộng đồng', slug: 'community-guidelines', status: 'published', lastUpdated: '2024-11-25', version: '1.2' },
    { id: 5, title: 'Chính sách Cookie', slug: 'cookie-policy', status: 'draft', lastUpdated: '2024-12-18', version: '1.0' },
];

export default function PolicyManagement() {
    const [policies] = useState(mockPolicies);
    const [selectedPolicy, setSelectedPolicy] = useState<typeof mockPolicies[0] | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editorContent, setEditorContent] = useState('');

    const handleEdit = (policy: typeof mockPolicies[0]) => {
        setSelectedPolicy(policy);
        setEditorContent(`# ${policy.title}\n\nNội dung của chính sách "${policy.title}" sẽ được hiển thị và chỉnh sửa tại đây.\n\n## 1. Giới thiệu\n\nĐây là mẫu nội dung cho chính sách. Admin có thể chỉnh sửa toàn bộ nội dung này.\n\n## 2. Điều khoản chính\n\n- Điều khoản 1\n- Điều khoản 2\n- Điều khoản 3`);
        setIsEditing(true);
    };

    return (
        <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#111418] p-6 font-[Manrope,sans-serif]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-[#111418] dark:text-white mb-2">
                        Quản Lý Chính Sách
                    </h1>
                    <p className="text-[#637588] dark:text-[#9dabb9]">
                        Tạo và quản lý các chính sách, điều khoản sử dụng hệ thống
                    </p>
                </div>
                <button className="mt-4 md:mt-0 px-6 py-3 bg-[#2b8cee] hover:bg-[#2b8cee]/90 text-white font-bold rounded-lg transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined">add</span>
                    Tạo chính sách mới
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-[#2b8cee]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#2b8cee]">description</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">{policies.length}</p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Tổng chính sách</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-500">public</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">
                                {policies.filter(p => p.status === 'published').length}
                            </p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Đã xuất bản</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-yellow-500">edit_note</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">
                                {policies.filter(p => p.status === 'draft').length}
                            </p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Bản nháp</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Policies List */}
            <div className="bg-white dark:bg-[#1c2127] rounded-xl shadow-sm border border-[#dce0e5] dark:border-[#3b4754] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#f6f7f8] dark:bg-[#111418] border-b border-[#dce0e5] dark:border-[#3b4754]">
                            <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Tên chính sách</th>
                            <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Phiên bản</th>
                            <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Cập nhật lần cuối</th>
                            <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Trạng thái</th>
                            <th className="text-right px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies.map((policy) => (
                            <tr key={policy.id} className="border-b border-[#dce0e5] dark:border-[#3b4754] hover:bg-[#f6f7f8] dark:hover:bg-[#111418]/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-semibold text-[#111418] dark:text-white">{policy.title}</p>
                                        <p className="text-sm text-[#637588] dark:text-[#9dabb9]">/{policy.slug}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-[#f6f7f8] dark:bg-[#111418] text-sm font-mono text-[#637588] dark:text-[#9dabb9]">
                                        v{policy.version}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-[#637588] dark:text-[#9dabb9]">{policy.lastUpdated}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${policy.status === 'published'
                                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                            : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                        }`}>
                                        {policy.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(policy)}
                                            className="p-2 hover:bg-[#2b8cee]/10 rounded-lg transition-colors text-[#637588] hover:text-[#2b8cee]"
                                            title="Chỉnh sửa"
                                        >
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                        <button className="p-2 hover:bg-[#2b8cee]/10 rounded-lg transition-colors text-[#637588] hover:text-[#2b8cee]" title="Xem lịch sử">
                                            <span className="material-symbols-outlined">history</span>
                                        </button>
                                        <button className="p-2 hover:bg-[#2b8cee]/10 rounded-lg transition-colors text-[#637588] hover:text-[#2b8cee]" title="Xem trước">
                                            <span className="material-symbols-outlined">visibility</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Editor Modal */}
            {isEditing && selectedPolicy && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-[#1c2127] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#dce0e5] dark:border-[#3b4754]">
                            <div>
                                <h2 className="text-xl font-bold text-[#111418] dark:text-white">
                                    Chỉnh sửa: {selectedPolicy.title}
                                </h2>
                                <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Phiên bản {selectedPolicy.version}</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-[#111418] rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-[#637588]">close</span>
                            </button>
                        </div>

                        {/* Editor Toolbar */}
                        <div className="flex items-center gap-2 px-6 py-3 border-b border-[#dce0e5] dark:border-[#3b4754] bg-[#f6f7f8] dark:bg-[#111418]">
                            <button className="p-2 hover:bg-white dark:hover:bg-[#1c2127] rounded-lg transition-colors text-[#637588]">
                                <span className="material-symbols-outlined text-[20px]">format_bold</span>
                            </button>
                            <button className="p-2 hover:bg-white dark:hover:bg-[#1c2127] rounded-lg transition-colors text-[#637588]">
                                <span className="material-symbols-outlined text-[20px]">format_italic</span>
                            </button>
                            <button className="p-2 hover:bg-white dark:hover:bg-[#1c2127] rounded-lg transition-colors text-[#637588]">
                                <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
                            </button>
                            <button className="p-2 hover:bg-white dark:hover:bg-[#1c2127] rounded-lg transition-colors text-[#637588]">
                                <span className="material-symbols-outlined text-[20px]">format_list_numbered</span>
                            </button>
                            <div className="h-6 w-px bg-[#dce0e5] dark:bg-[#3b4754] mx-2" />
                            <button className="p-2 hover:bg-white dark:hover:bg-[#1c2127] rounded-lg transition-colors text-[#637588]">
                                <span className="material-symbols-outlined text-[20px]">link</span>
                            </button>
                            <button className="p-2 hover:bg-white dark:hover:bg-[#1c2127] rounded-lg transition-colors text-[#637588]">
                                <span className="material-symbols-outlined text-[20px]">image</span>
                            </button>
                        </div>

                        {/* Editor Content */}
                        <div className="flex-1 overflow-auto p-6">
                            <textarea
                                value={editorContent}
                                onChange={(e) => setEditorContent(e.target.value)}
                                className="w-full h-full min-h-[400px] p-4 rounded-lg border border-[#dce0e5] dark:border-[#3b4754] bg-white dark:bg-[#111418] text-[#111418] dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-[#2b8cee]/50 focus:border-[#2b8cee] transition-all"
                                placeholder="Nhập nội dung chính sách..."
                            />
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between p-6 border-t border-[#dce0e5] dark:border-[#3b4754]">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#637588] text-[18px]">info</span>
                                <span className="text-sm text-[#637588] dark:text-[#9dabb9]">Sử dụng Markdown để định dạng</span>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-3 border border-[#dce0e5] dark:border-[#3b4754] rounded-lg font-bold text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-[#111418] transition-colors"
                                >
                                    Hủy
                                </button>
                                <button className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600 transition-colors">
                                    Lưu nháp
                                </button>
                                <button className="px-6 py-3 bg-[#2b8cee] text-white rounded-lg font-bold hover:bg-[#2b8cee]/90 transition-colors">
                                    Xuất bản
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
