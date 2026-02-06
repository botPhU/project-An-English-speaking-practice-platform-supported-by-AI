import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout';
import { adminService } from '../../services/adminService';

interface Package {
    id: string;
    name: string;
    tier: string;
    price: string;
    cycle: string;
    features: string[];
    users: number;
    status: 'active' | 'inactive';
    icon: string;
    iconColor: string;
    iconBg: string;
}

interface PackageStats {
    totalPackages: number;
    avgRevenue: string;
    totalSubscribers: number;
}

type StatusFilter = 'all' | 'active' | 'inactive';

const PackageManagement: React.FC = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [stats, setStats] = useState<PackageStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        price: '',
        description: '',
        features: [] as string[],
        status: 'active' as 'active' | 'inactive'
    });
    const [saving, setSaving] = useState(false);
    const [newFeature, setNewFeature] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await adminService.getPackages();

            const packagesData = response.data.packages || response.data || [];
            const mappedPackages = packagesData.map((pkg: any, index: number) => {
                const icons = ['emoji_objects', 'star', 'diamond', 'workspace_premium', 'military_tech'];
                const colors = ['text-gray-400', 'text-blue-400', 'text-purple-400', 'text-yellow-400', 'text-primary'];
                const bgs = ['bg-gray-700/50', 'bg-blue-500/20', 'bg-purple-500/20', 'bg-yellow-500/20', 'bg-primary/20'];

                return {
                    id: pkg.id?.toString() || `PKG${index + 1}`,
                    name: pkg.name,
                    tier: pkg.tier || pkg.package_type || 'Standard',
                    price: pkg.price ? `${pkg.price.toLocaleString()} ₫` : '0 ₫',
                    cycle: pkg.cycle || pkg.billing_cycle || 'Tháng',
                    features: pkg.features || [],
                    users: pkg.users || pkg.subscriber_count || 0,
                    status: pkg.status || 'active',
                    icon: icons[index % icons.length],
                    iconColor: colors[index % colors.length],
                    iconBg: bgs[index % bgs.length]
                };
            });

            setPackages(mappedPackages);

            setStats({
                totalPackages: mappedPackages.length,
                avgRevenue: response.data.avg_revenue || '150.000 ₫',
                totalSubscribers: mappedPackages.reduce((sum: number, pkg: Package) => sum + pkg.users, 0)
            });

            setError(null);
        } catch (err) {
            console.error('Error fetching packages:', err);
            setError('Không thể tải danh sách gói');
            // Set empty state instead of fallback
            setStats({
                totalPackages: 0,
                avgRevenue: '0 ₫',
                totalSubscribers: 0
            });
            setPackages([]);
        } finally {
            setLoading(false);
        }
    };

    // Open edit modal
    const openEditModal = (pkg: Package) => {
        setIsCreateMode(false);
        setEditingPackage(pkg);
        setEditFormData({
            name: pkg.name,
            price: pkg.price.replace(/[^\d]/g, ''), // Remove non-digits
            description: '',
            features: [...pkg.features],
            status: pkg.status
        });
        setShowEditModal(true);
    };

    // Save package (create or update)
    const handleSavePackage = async () => {
        try {
            setSaving(true);

            const packageData = {
                name: editFormData.name,
                price: parseInt(editFormData.price) || 0,
                description: editFormData.description,
                features: editFormData.features,
                status: editFormData.status
            };

            if (isCreateMode) {
                // Create new package
                const response = await adminService.createPackage(packageData);
                const newPkg = response.data;
                setPackages(prev => [...prev, {
                    id: newPkg.id || Date.now(),
                    name: editFormData.name,
                    tier: 'custom',
                    price: `${parseInt(editFormData.price).toLocaleString()} đồng`,
                    cycle: 'tháng',
                    features: editFormData.features,
                    users: 0,
                    status: editFormData.status,
                    icon: 'package_2',
                    iconColor: 'text-primary',
                    iconBg: 'bg-primary/20'
                }]);
                alert('Tạo gói mới thành công!');
            } else if (editingPackage) {
                // Update existing package
                await adminService.updatePackage(editingPackage.id, packageData);
                setPackages(prev => prev.map(p =>
                    p.id === editingPackage.id
                        ? { ...p, name: editFormData.name, price: `${parseInt(editFormData.price).toLocaleString()} đồng`, features: editFormData.features, status: editFormData.status }
                        : p
                ));
                alert('Cập nhật gói thành công!');
            }

            setShowEditModal(false);
            setEditingPackage(null);
            setIsCreateMode(false);
        } catch (err) {
            console.error('Error saving package:', err);
            alert(isCreateMode ? 'Lỗi khi tạo gói mới' : 'Lỗi khi cập nhật gói');
        } finally {
            setSaving(false);
        }
    };

    // Add feature
    const addFeature = () => {
        if (newFeature.trim()) {
            setEditFormData(prev => ({
                ...prev,
                features: [...prev.features, newFeature.trim()]
            }));
            setNewFeature('');
        }
    };

    // Remove feature
    const removeFeature = (index: number) => {
        setEditFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const filteredPackages = packages.filter(pkg => {
        const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pkg.tier.toLowerCase().includes(searchQuery.toLowerCase());
        if (statusFilter === 'all') return matchesSearch;
        return matchesSearch && pkg.status === statusFilter;
    });

    return (
        <AdminLayout
            title="Quản Lý Gói Dịch Vụ"
            subtitle="Quản lý các gói subscription và pricing"
            icon="inventory_2"
            actions={
                <button
                    onClick={() => {
                        setIsCreateMode(true);
                        setEditingPackage(null);
                        setEditFormData({
                            name: '',
                            price: '',
                            description: '',
                            features: [],
                            status: 'active'
                        });
                        setShowEditModal(true);
                    }}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/25 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Tạo gói mới
                </button>
            }
        >
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754]">
                        <p className="text-[#9dabb9] text-sm font-medium">Tổng số gói</p>
                        {loading ? (
                            <div className="h-9 w-12 bg-[#3e4854] animate-pulse rounded"></div>
                        ) : (
                            <p className="text-white text-3xl font-bold">{stats?.totalPackages}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754]">
                        <p className="text-[#9dabb9] text-sm font-medium">Doanh thu TB/gói</p>
                        {loading ? (
                            <div className="h-9 w-24 bg-[#3e4854] animate-pulse rounded"></div>
                        ) : (
                            <p className="text-white text-3xl font-bold">{stats?.avgRevenue}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754]">
                        <p className="text-[#9dabb9] text-sm font-medium">Tổng người đăng ký</p>
                        {loading ? (
                            <div className="h-9 w-20 bg-[#3e4854] animate-pulse rounded"></div>
                        ) : (
                            <p className="text-white text-3xl font-bold">{stats?.totalSubscribers?.toLocaleString()}</p>
                        )}
                    </div>
                </div>

                {/* Search */}
                <div className="flex gap-4 bg-[#283039]/50 p-4 rounded-xl border border-[#3b4754]">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9dabb9]">search</span>
                        <input
                            type="text"
                            className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Tìm kiếm gói..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                        className="bg-[#1a222a] border border-[#3b4754] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">Tất cả</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </select>
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-xl bg-[#283039] border border-[#3b4754] p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="size-12 rounded-lg bg-[#3e4854] animate-pulse"></div>
                                    <div className="space-y-2">
                                        <div className="h-5 w-24 bg-[#3e4854] animate-pulse rounded"></div>
                                        <div className="h-4 w-16 bg-[#3e4854] animate-pulse rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-8 w-32 bg-[#3e4854] animate-pulse rounded"></div>
                                    <div className="h-4 w-20 bg-[#3e4854] animate-pulse rounded"></div>
                                </div>
                            </div>
                        ))
                    ) : filteredPackages.length === 0 ? (
                        <div className="col-span-full text-center text-[#9dabb9] py-8">
                            {error || 'Không tìm thấy gói nào'}
                        </div>
                    ) : (
                        filteredPackages.map((pkg) => (
                            <div key={pkg.id} className="rounded-xl bg-[#283039] border border-[#3b4754] p-6 hover:border-primary/50 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`size-12 rounded-lg ${pkg.iconBg} flex items-center justify-center`}>
                                            <span className={`material-symbols-outlined ${pkg.iconColor}`}>{pkg.icon}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{pkg.name}</h3>
                                            <p className="text-xs text-[#9dabb9]">{pkg.tier}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${pkg.status === 'active' ? 'bg-[#0bda5b]/20 text-[#0bda5b]' : 'bg-gray-500/20 text-gray-400'}`}>
                                        {pkg.status === 'active' ? 'Hoạt động' : 'Tắt'}
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <p className="text-2xl font-bold text-white">{pkg.price}</p>
                                    <p className="text-sm text-[#9dabb9]">/{pkg.cycle}</p>
                                </div>
                                <div className="mb-4 space-y-2">
                                    {pkg.features.slice(0, 3).map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-[#9dabb9]">
                                            <span className="material-symbols-outlined text-[#0bda5b] text-[16px]">check</span>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-[#3b4754]">
                                    <span className="text-sm text-[#9dabb9]">{pkg.users.toLocaleString()} users</span>
                                    <button
                                        onClick={() => openEditModal(pkg)}
                                        className="text-primary text-sm font-medium hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        Chỉnh sửa →
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Edit/Create Modal */}
                {showEditModal && (isCreateMode || editingPackage) && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                        <div className="bg-[#283039] rounded-xl p-6 w-full max-w-lg mx-4 border border-[#3b4754]">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    {isCreateMode ? '🆕 Tạo gói mới' : `✏️ Chỉnh sửa: ${editingPackage?.name}`}
                                </h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-[#9dabb9] hover:text-white"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm text-[#9dabb9] mb-1">Tên gói</label>
                                    <input
                                        type="text"
                                        value={editFormData.name}
                                        onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm text-[#9dabb9] mb-1">Giá (VNĐ)</label>
                                    <input
                                        type="number"
                                        value={editFormData.price}
                                        onChange={(e) => setEditFormData(prev => ({ ...prev, price: e.target.value }))}
                                        className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm text-[#9dabb9] mb-1">Trạng thái</label>
                                    <select
                                        value={editFormData.status}
                                        onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                                        className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="active">Hoạt động</option>
                                        <option value="inactive">Không hoạt động</option>
                                    </select>
                                </div>

                                {/* Features */}
                                <div>
                                    <label className="block text-sm text-[#9dabb9] mb-1">Tính năng</label>
                                    <div className="space-y-2 mb-2">
                                        {editFormData.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <span className="flex-1 text-white text-sm bg-[#1a222a] px-3 py-1.5 rounded border border-[#3b4754]">{feature}</span>
                                                <button
                                                    onClick={() => removeFeature(idx)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                                            placeholder="Thêm tính năng mới..."
                                            className="flex-1 bg-[#1a222a] border border-[#3b4754] text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        <button
                                            onClick={addFeature}
                                            className="bg-primary/20 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/30"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">add</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 py-2.5 border border-[#3b4754] text-[#9dabb9] rounded-lg hover:bg-[#3e4854] transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSavePackage}
                                    disabled={saving}
                                    className="flex-1 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <><span className="material-symbols-outlined animate-spin text-[18px]">sync</span> Đang lưu...</>
                                    ) : (
                                        <><span className="material-symbols-outlined text-[18px]">save</span> Lưu thay đổi</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default PackageManagement;
