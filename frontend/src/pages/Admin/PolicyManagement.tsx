import { useState } from 'react';
import { AdminLayout } from '../../components/layout';

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
        <AdminLayout
            title="Quản Lý Chính Sách"
            subtitle="Tạo và quản lý các chính sách, điều khoản sử dụng hệ thống"
            icon="policy"
            actions={
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/25 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Tạo chính sách mới
                </button>
            }
        >
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Tổng chính sách</p>
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-md text-[20px]">
                                description
                            </span>
                        </div>
                        <p className="text-white tracking-tight text-3xl font-bold">{policies.length}</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Đã xuất bản</p>
                            <span className="material-symbols-outlined text-[#0bda5b] bg-[#0bda5b]/10 p-1 rounded-md text-[20px]">
                                public
                            </span>
                        </div>
                        <p className="text-white tracking-tight text-3xl font-bold">
                            {policies.filter(p => p.status === 'published').length}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Bản nháp</p>
                            <span className="material-symbols-outlined text-yellow-500 bg-yellow-500/10 p-1 rounded-md text-[20px]">
                                edit_note
                            </span>
                        </div>
                        <p className="text-white tracking-tight text-3xl font-bold">
                            {policies.filter(p => p.status === 'draft').length}
                        </p>
                    </div>
                </div>

                {/* Policies List */}
                <div className="rounded-xl border border-[#3b4754] bg-[#1a222a] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#283039] border-b border-[#3b4754]">
                                <tr>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Tên chính sách</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Phiên bản</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Cập nhật lần cuối</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Trạng thái</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#3b4754]">
                                {policies.map((policy) => (
                                    <tr key={policy.id} className="group hover:bg-[#283039] transition-colors">
                                        <td className="p-4">
                                            <div>
                                                <p className="font-semibold text-white">{policy.title}</p>
                                                <p className="text-sm text-[#9dabb9]">/{policy.slug}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 rounded-full bg-[#111418] text-sm font-mono text-[#9dabb9]">
                                                v{policy.version}
                                            </span>
                                        </td>
                                        <td className="p-4 text-[#9dabb9]">{policy.lastUpdated}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${policy.status === 'published'
                                                ? 'bg-[#0bda5b]/20 text-[#0bda5b] ring-[#0bda5b]/30'
                                                : 'bg-yellow-500/20 text-yellow-500 ring-yellow-500/30'
                                                }`}>
                                                {policy.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(policy)}
                                                    className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors" title="Xem lịch sử">
                                                    <span className="material-symbols-outlined text-[20px]">history</span>
                                                </button>
                                                <button className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors" title="Xem trước">
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Editor Modal */}
                {isEditing && selectedPolicy && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-[#1c2127] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-[#3b4754]">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-[#3b4754]">
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        Chỉnh sửa: {selectedPolicy.title}
                                    </h2>
                                    <p className="text-sm text-[#9dabb9]">Phiên bản {selectedPolicy.version}</p>
                                </div>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="p-2 hover:bg-[#283039] rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[#9dabb9]">close</span>
                                </button>
                            </div>

                            {/* Editor Toolbar */}
                            <div className="flex items-center gap-2 px-6 py-3 border-b border-[#3b4754] bg-[#111418]">
                                <button className="p-2 hover:bg-[#283039] rounded-lg transition-colors text-[#9dabb9]">
                                    <span className="material-symbols-outlined text-[20px]">format_bold</span>
                                </button>
                                <button className="p-2 hover:bg-[#283039] rounded-lg transition-colors text-[#9dabb9]">
                                    <span className="material-symbols-outlined text-[20px]">format_italic</span>
                                </button>
                                <button className="p-2 hover:bg-[#283039] rounded-lg transition-colors text-[#9dabb9]">
                                    <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
                                </button>
                                <button className="p-2 hover:bg-[#283039] rounded-lg transition-colors text-[#9dabb9]">
                                    <span className="material-symbols-outlined text-[20px]">format_list_numbered</span>
                                </button>
                                <div className="h-6 w-px bg-[#3b4754] mx-2" />
                                <button className="p-2 hover:bg-[#283039] rounded-lg transition-colors text-[#9dabb9]">
                                    <span className="material-symbols-outlined text-[20px]">link</span>
                                </button>
                                <button className="p-2 hover:bg-[#283039] rounded-lg transition-colors text-[#9dabb9]">
                                    <span className="material-symbols-outlined text-[20px]">image</span>
                                </button>
                            </div>

                            {/* Editor Content */}
                            <div className="flex-1 overflow-auto p-6">
                                <textarea
                                    value={editorContent}
                                    onChange={(e) => setEditorContent(e.target.value)}
                                    className="w-full h-full min-h-[400px] p-4 rounded-lg border border-[#3b4754] bg-[#111418] text-white font-mono text-sm resize-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="Nhập nội dung chính sách..."
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-between p-6 border-t border-[#3b4754]">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#9dabb9] text-[18px]">info</span>
                                    <span className="text-sm text-[#9dabb9]">Sử dụng Markdown để định dạng</span>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3 border border-[#3b4754] rounded-lg font-bold text-white hover:bg-[#283039] transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600 transition-colors">
                                        Lưu nháp
                                    </button>
                                    <button className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors">
                                        Xuất bản
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
