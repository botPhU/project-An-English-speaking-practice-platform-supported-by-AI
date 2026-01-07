import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout';
import { adminService } from '../../services/adminService';

interface Policy {
    id: number;
    title: string;
    slug: string;
    status: 'published' | 'draft';
    lastUpdated: string;
    version: string;
    content?: string;
}

const PolicyManagement: React.FC = () => {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
    const [editContent, setEditContent] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await adminService.getPolicies();

            const policyData = response.data.policies || response.data || [];
            const mappedPolicies = policyData.map((policy: any) => ({
                id: policy.id,
                title: policy.title,
                slug: policy.slug,
                status: policy.status || 'draft',
                lastUpdated: policy.last_updated || policy.updated_at || 'N/A',
                version: policy.version || '1.0',
                content: policy.content || ''
            }));

            setPolicies(mappedPolicies);
            if (mappedPolicies.length > 0) {
                setSelectedPolicy(mappedPolicies[0]);
                setEditContent(mappedPolicies[0].content || '');
            }

            setError(null);
        } catch (err) {
            console.error('Error fetching policies:', err);
            setError('Không thể tải chính sách');
            // Set empty state instead of fallback mock data
            setPolicies([]);
            setSelectedPolicy(null);
            setEditContent('');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPolicy = (policy: Policy) => {
        setSelectedPolicy(policy);
        setEditContent(policy.content || '');
    };

    const handleSave = async () => {
        if (!selectedPolicy) return;

        try {
            setSaving(true);
            await adminService.updatePolicy(selectedPolicy.id.toString(), { content: editContent });

            setPolicies(prev => prev.map(p =>
                p.id === selectedPolicy.id ? { ...p, content: editContent, lastUpdated: new Date().toISOString().split('T')[0] } : p
            ));
        } catch (err) {
            console.error('Error saving policy:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout
            title="Quản Lý Chính Sách"
            subtitle="Quản lý nội dung điều khoản và chính sách"
            icon="policy"
            actions={
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-[18px]">{saving ? 'sync' : 'save'}</span>
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
            }
        >
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Policy List */}
                    <div className="lg:col-span-1">
                        <div className="rounded-xl bg-[#283039] border border-[#3b4754] overflow-hidden">
                            <div className="p-4 border-b border-[#3b4754]">
                                <h3 className="font-bold text-white">Danh sách chính sách</h3>
                            </div>
                            <div className="divide-y divide-[#3b4754]">
                                {loading ? (
                                    [...Array(3)].map((_, i) => (
                                        <div key={i} className="p-4">
                                            <div className="h-5 w-32 bg-[#3e4854] animate-pulse rounded mb-2"></div>
                                            <div className="h-4 w-24 bg-[#3e4854] animate-pulse rounded"></div>
                                        </div>
                                    ))
                                ) : policies.length === 0 ? (
                                    <div className="p-4 text-center text-[#9dabb9]">{error || 'Không có chính sách'}</div>
                                ) : (
                                    policies.map((policy) => (
                                        <button
                                            key={policy.id}
                                            onClick={() => handleSelectPolicy(policy)}
                                            className={`w-full p-4 text-left hover:bg-[#3e4854]/50 transition-colors ${selectedPolicy?.id === policy.id ? 'bg-primary/10 border-l-2 border-primary' : ''}`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className={`font-medium ${selectedPolicy?.id === policy.id ? 'text-primary' : 'text-white'}`}>
                                                    {policy.title}
                                                </h4>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${policy.status === 'published' ? 'bg-[#0bda5b]/20 text-[#0bda5b]' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                    {policy.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#9dabb9]">v{policy.version} • {policy.lastUpdated}</p>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="lg:col-span-3">
                        <div className="rounded-xl bg-[#283039] border border-[#3b4754] overflow-hidden">
                            <div className="p-4 border-b border-[#3b4754] flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-white">{selectedPolicy?.title || 'Chọn chính sách'}</h3>
                                    <p className="text-xs text-[#9dabb9]">slug: {selectedPolicy?.slug || 'N/A'}</p>
                                </div>
                                {selectedPolicy && (
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1.5 text-sm text-[#9dabb9] hover:text-white hover:bg-[#3e4854] rounded-lg transition-colors">
                                            Xem trước
                                        </button>
                                        <button className="px-3 py-1.5 text-sm text-[#9dabb9] hover:text-white hover:bg-[#3e4854] rounded-lg transition-colors">
                                            Lịch sử
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                {loading ? (
                                    <div className="h-96 bg-[#3e4854] animate-pulse rounded"></div>
                                ) : selectedPolicy ? (
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full h-96 bg-[#1a222a] border border-[#3b4754] text-white rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        placeholder="Nhập nội dung chính sách (Markdown)..."
                                    />
                                ) : (
                                    <div className="h-96 flex items-center justify-center text-[#9dabb9]">
                                        Chọn một chính sách để chỉnh sửa
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default PolicyManagement;
