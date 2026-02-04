import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

interface PackageFormModalProps {
    packageId?: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

interface PackageFormData {
    name: string;
    tier: string;
    price: number;
    cycle: 'monthly' | 'yearly' | 'lifetime';
    features: string[];
    description: string;
    icon: string;
    iconColor: string;
    iconBg: string;
    status: 'active' | 'inactive';
    max_mentors: number;
    ai_sessions_limit: number;
    priority_support: boolean;
}

const ICONS = [
    { name: 'star', label: 'Star' },
    { name: 'diamond', label: 'Diamond' },
    { name: 'rocket_launch', label: 'Rocket' },
    { name: 'workspace_premium', label: 'Premium' },
    { name: 'school', label: 'School' },
    { name: 'military_tech', label: 'Medal' },
];

const COLORS = [
    { name: 'Blue', value: '#0ea5e9', bg: 'bg-blue-500/20' },
    { name: 'Green', value: '#0bda5b', bg: 'bg-green-500/20' },
    { name: 'Purple', value: '#a855f7', bg: 'bg-purple-500/20' },
    { name: 'Orange', value: '#f97316', bg: 'bg-orange-500/20' },
    { name: 'Pink', value: '#ec4899', bg: 'bg-pink-500/20' },
];

const PackageFormModal: React.FC<PackageFormModalProps> = ({
    packageId,
    isOpen,
    onClose,
    onSave
}) => {
    const [formData, setFormData] = useState<PackageFormData>({
        name: '',
        tier: 'basic',
        price: 0,
        cycle: 'monthly',
        features: [''],
        description: '',
        icon: 'star',
        iconColor: '#0ea5e9',
        iconBg: 'bg-blue-500/20',
        status: 'active',
        max_mentors: 1,
        ai_sessions_limit: 10,
        priority_support: false
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen && packageId) {
            fetchPackageDetails();
        } else if (isOpen && !packageId) {
            // Reset form for new package
            setFormData({
                name: '',
                tier: 'basic',
                price: 0,
                cycle: 'monthly',
                features: [''],
                description: '',
                icon: 'star',
                iconColor: '#0ea5e9',
                iconBg: 'bg-blue-500/20',
                status: 'active',
                max_mentors: 1,
                ai_sessions_limit: 10,
                priority_support: false
            });
        }
    }, [isOpen, packageId]);

    const fetchPackageDetails = async () => {
        // In a real implementation, you'd fetch the package details
        setLoading(true);
        try {
            // Mock implementation - replace with actual API call
            // const response = await adminService.getPackageDetails(packageId);
            // setFormData(response.data);
        } catch (error) {
            console.error('Error fetching package details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof PackageFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    };

    const removeFeature = (index: number) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, features: newFeatures.length > 0 ? newFeatures : [''] }));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Tên gói không được để trống';
        }
        if (formData.price < 0) {
            newErrors.price = 'Giá không hợp lệ';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setSaving(true);
        try {
            const cleanFeatures = formData.features.filter(f => f.trim() !== '');
            const dataToSave = { ...formData, features: cleanFeatures };

            if (packageId) {
                await adminService.updatePackage(packageId, dataToSave);
            } else {
                await adminService.createPackage(dataToSave);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving package:', error);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#1a222a] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-[#3e4854]/50">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#3e4854]">
                    <h2 className="text-xl font-bold text-white">
                        {packageId ? 'Chỉnh sửa gói' : 'Tạo gói mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#283039] rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined text-[#9dabb9]">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-[#9dabb9] mb-2">
                                        Tên gói <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className={`w-full bg-[#283039] border ${errors.name ? 'border-red-500' : 'border-[#3e4854]'} rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary`}
                                        placeholder="VD: Premium, Basic, Pro..."
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#9dabb9] mb-2">
                                        Tier
                                    </label>
                                    <select
                                        value={formData.tier}
                                        onChange={(e) => handleChange('tier', e.target.value)}
                                        className="w-full bg-[#283039] border border-[#3e4854] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="free">Free</option>
                                        <option value="basic">Basic</option>
                                        <option value="premium">Premium</option>
                                        <option value="enterprise">Enterprise</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#9dabb9] mb-2">
                                        Trạng thái
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => handleChange('status', e.target.value)}
                                        className="w-full bg-[#283039] border border-[#3e4854] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="active">Hoạt động</option>
                                        <option value="inactive">Tạm dừng</option>
                                    </select>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#9dabb9] mb-2">
                                        Giá (USD)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                                        className={`w-full bg-[#283039] border ${errors.price ? 'border-red-500' : 'border-[#3e4854]'} rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary`}
                                        min="0"
                                        step="0.01"
                                    />
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#9dabb9] mb-2">
                                        Chu kỳ thanh toán
                                    </label>
                                    <select
                                        value={formData.cycle}
                                        onChange={(e) => handleChange('cycle', e.target.value)}
                                        className="w-full bg-[#283039] border border-[#3e4854] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="monthly">Hàng tháng</option>
                                        <option value="yearly">Hàng năm</option>
                                        <option value="lifetime">Trọn đời</option>
                                    </select>
                                </div>
                            </div>

                            {/* Limits */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#9dabb9] mb-2">
                                        Số mentor tối đa
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.max_mentors}
                                        onChange={(e) => handleChange('max_mentors', parseInt(e.target.value) || 0)}
                                        className="w-full bg-[#283039] border border-[#3e4854] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#9dabb9] mb-2">
                                        Giới hạn phiên AI/tháng
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.ai_sessions_limit}
                                        onChange={(e) => handleChange('ai_sessions_limit', parseInt(e.target.value) || 0)}
                                        className="w-full bg-[#283039] border border-[#3e4854] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                        min="0"
                                    />
                                    <p className="text-xs text-[#9dabb9] mt-1">0 = Không giới hạn</p>
                                </div>
                            </div>

                            {/* Priority Support Toggle */}
                            <div className="flex items-center justify-between bg-[#283039] rounded-lg p-4 border border-[#3e4854]">
                                <div>
                                    <p className="text-white font-medium">Hỗ trợ ưu tiên</p>
                                    <p className="text-sm text-[#9dabb9]">Người dùng được hỗ trợ ưu tiên 24/7</p>
                                </div>
                                <button
                                    onClick={() => handleChange('priority_support', !formData.priority_support)}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${formData.priority_support ? 'bg-primary' : 'bg-[#3e4854]'
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.priority_support ? 'translate-x-7' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Icon Selection */}
                            <div>
                                <label className="block text-sm font-medium text-[#9dabb9] mb-2">
                                    Icon
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {ICONS.map(icon => (
                                        <button
                                            key={icon.name}
                                            onClick={() => handleChange('icon', icon.name)}
                                            className={`p-3 rounded-lg border transition-colors ${formData.icon === icon.name
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-[#3e4854] text-[#9dabb9] hover:bg-[#283039]'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined">{icon.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div>
                                <label className="block text-sm font-medium text-[#9dabb9] mb-2">
                                    Màu sắc
                                </label>
                                <div className="flex gap-2">
                                    {COLORS.map(color => (
                                        <button
                                            key={color.name}
                                            onClick={() => {
                                                handleChange('iconColor', color.value);
                                                handleChange('iconBg', color.bg);
                                            }}
                                            className={`w-10 h-10 rounded-lg border-2 transition-all ${formData.iconColor === color.value
                                                    ? 'border-white scale-110'
                                                    : 'border-transparent hover:scale-105'
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-[#9dabb9] mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    className="w-full bg-[#283039] border border-[#3e4854] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                                    placeholder="Mô tả ngắn về gói dịch vụ..."
                                />
                            </div>

                            {/* Features */}
                            <div>
                                <label className="block text-sm font-medium text-[#9dabb9] mb-2">
                                    Tính năng
                                </label>
                                <div className="space-y-2">
                                    {formData.features.map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                className="flex-1 bg-[#283039] border border-[#3e4854] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                                placeholder="VD: Truy cập không giới hạn..."
                                            />
                                            <button
                                                onClick={() => removeFeature(index)}
                                                className="p-2 hover:bg-red-500/10 text-[#9dabb9] hover:text-red-400 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={addFeature}
                                    className="mt-2 flex items-center gap-2 text-primary text-sm hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">add</span>
                                    Thêm tính năng
                                </button>
                            </div>

                            {/* Preview */}
                            <div className="border-t border-[#3e4854] pt-6">
                                <label className="block text-sm font-medium text-[#9dabb9] mb-3">
                                    Xem trước
                                </label>
                                <div className="bg-[#283039] rounded-xl p-6 border border-[#3e4854]/50">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div
                                            className={`size-12 rounded-xl ${formData.iconBg} flex items-center justify-center`}
                                        >
                                            <span
                                                className="material-symbols-outlined text-2xl"
                                                style={{ color: formData.iconColor }}
                                            >
                                                {formData.icon}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">
                                                {formData.name || 'Tên gói'}
                                            </h4>
                                            <p className="text-primary font-semibold">
                                                ${formData.price}/{formData.cycle === 'monthly' ? 'tháng' : formData.cycle === 'yearly' ? 'năm' : 'trọn đời'}
                                            </p>
                                        </div>
                                    </div>
                                    {formData.features.filter(f => f.trim()).length > 0 && (
                                        <ul className="space-y-2">
                                            {formData.features.filter(f => f.trim()).map((feature, index) => (
                                                <li key={index} className="flex items-center gap-2 text-sm text-[#9dabb9]">
                                                    <span className="material-symbols-outlined text-[#0bda5b] text-base">check</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-[#3e4854]">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-[#9dabb9] hover:text-white transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        {packageId ? 'Cập nhật' : 'Tạo gói'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PackageFormModal;
