import React, { useState, useEffect } from 'react';
import LearnerLayout from '../../layouts/LearnerLayout';
import { useAuth } from '../../context/AuthContext';
import { learnerService } from '../../services/learnerService';

interface Package {
    id: number;
    name: string;
    price: number;
    duration: string;
    features: string[];
    hasMentor: boolean;
    hasAiAdvanced: boolean;
    popular?: boolean;
}

interface Subscription {
    isActive: boolean;
    packageName?: string;
    expiresAt?: string;
    daysRemaining?: number;
}

const Subscription: React.FC = () => {
    const { user: authUser } = useAuth();
    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
    const [packages, setPackages] = useState<Package[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);

    useEffect(() => {
        if (authUser?.id) {
            fetchData();
        }
    }, [authUser?.id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [pkgsRes, subRes] = await Promise.all([
                learnerService.getPackages(),
                learnerService.getSubscriptionStatus(Number(authUser?.id))
            ]);

            // Map backend package data to frontend interface if necessary
            // Backend returns list of packages from PurchaseController
            setPackages(pkgsRes.data.map((p: any) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                duration: `${p.duration_days} ngày`,
                features: p.description ? p.description.split(',') : [],
                hasMentor: p.name.toLowerCase().includes('premium') || p.name.toLowerCase().includes('pro'),
                hasAiAdvanced: p.name.toLowerCase().includes('pro'),
                popular: p.name.toLowerCase().includes('premium')
            })));

            if (subRes.data && subRes.data.is_active) {
                const expiresAt = new Date(subRes.data.end_date);
                const now = new Date();
                const diffTime = expiresAt.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                setCurrentSubscription({
                    isActive: true,
                    packageName: subRes.data.package_name,
                    expiresAt: subRes.data.end_date.split('T')[0],
                    daysRemaining: diffDays > 0 ? diffDays : 0
                });
            } else {
                setCurrentSubscription({ isActive: false });
            }
        } catch (error) {
            console.error('Error fetching subscription data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = (packageId: number) => {
        setSelectedPackage(packageId);
        setShowConfirmModal(true);
    };

    const confirmUpgrade = async () => {
        if (!selectedPackage || !authUser?.id) return;

        try {
            setPurchasing(true);
            await learnerService.purchasePackage(Number(authUser.id), selectedPackage);
            alert('Nâng cấp thành công! Vui lòng tải lại trang để cập nhật thông tin.');
            setShowConfirmModal(false);
            fetchData();
        } catch (error) {
            console.error('Error purchasing package:', error);
            alert('Có lỗi xảy ra trong quá trình nâng cấp. Vui lòng thử lại sau.');
        } finally {
            setPurchasing(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    if (loading) {
        return (
            <LearnerLayout title="Gói Đăng Ký">
                <div className="flex items-center justify-center h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </LearnerLayout>
        );
    }

    return (
        <LearnerLayout title="Gói Đăng Ký">
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-white">
                        💎 Quản lý Gói đăng ký
                    </h1>
                    <p className="text-text-secondary">
                        Nâng cấp tài khoản để mở khóa toàn bộ tính năng và học cùng Mentor.
                    </p>
                </div>

                {/* Current Subscription */}
                {currentSubscription?.isActive && (
                    <div className="bg-gradient-to-r from-primary/20 to-purple-600/20 p-6 rounded-2xl border border-primary/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[10rem] text-primary">
                                verified_user
                            </span>
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-1">
                                <span className="text-primary text-xs font-bold tracking-wider uppercase">Gói hiện tại</span>
                                <h2 className="text-2xl font-bold text-white">
                                    {currentSubscription.packageName} Plan
                                </h2>
                                <p className="text-text-secondary text-sm">
                                    Thanh toán lần cuối: {currentSubscription.expiresAt} ({currentSubscription.daysRemaining} ngày còn lại)
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="px-4 py-2 bg-green-500/20 text-green-500 rounded-lg border border-green-500/30 font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                                    Đang hoạt động
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-2 min-w-[200px]">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                                        style={{ width: `${Math.min(100, (currentSubscription.daysRemaining! / 30) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Package Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className={`relative bg-surface-dark border rounded-2xl p-8 transition-all hover:scale-[1.02] ${pkg.popular
                                    ? 'border-primary shadow-[0_0_30px_rgba(43,140,238,0.15)] ring-1 ring-primary'
                                    : 'border-border-dark hover:border-primary/50'
                                }`}
                        >
                            {pkg.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                                    Phổ biến nhất
                                </div>
                            )}

                            <div className="space-y-4 mb-8">
                                <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-white">{formatPrice(pkg.price)}</span>
                                    <span className="text-text-secondary text-sm">/ {pkg.duration}</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {pkg.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-text-secondary">
                                        <span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check_circle</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {pkg.hasMentor && (
                                    <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase rounded-md border border-green-500/20">
                                        Mentor Support
                                    </span>
                                )}
                                {pkg.hasAiAdvanced && (
                                    <span className="px-3 py-1 bg-purple-500/10 text-purple-500 text-[10px] font-bold uppercase rounded-md border border-purple-500/20">
                                        Advanced AI
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => handleUpgrade(pkg.id)}
                                disabled={currentSubscription?.packageName === pkg.name || purchasing}
                                className={`w-full py-4 rounded-xl font-bold transition-all ${currentSubscription?.packageName === pkg.name
                                        ? 'bg-surface-light/50 text-text-secondary cursor-default border border-border-dark'
                                        : pkg.popular
                                            ? 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25'
                                            : 'bg-white/5 hover:bg-white/10 text-white border border-border-dark'
                                    }`}
                            >
                                {currentSubscription?.packageName === pkg.name ? 'Gói hiện tại' : 'Đăng ký ngay'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Confirm Modal */}
                {showConfirmModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-surface-dark border border-border-dark rounded-2xl p-8 max-w-sm w-full space-y-6 animate-in zoom-in-95 duration-200">
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-primary text-3xl">shopping_cart</span>
                                </div>
                                <h3 className="text-xl font-bold text-white">Xác nhận nâng cấp?</h3>
                                <p className="text-text-secondary text-sm">
                                    Bạn đang thực hiện nâng cấp tài khoản lên gói mới. Vui lòng xác nhận để tiếp tục.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={confirmUpgrade}
                                    disabled={purchasing}
                                    className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all disabled:opacity-50"
                                >
                                    {purchasing ? 'Đang xử lý...' : 'Xác nhận'}
                                </button>
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    disabled={purchasing}
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-border-dark"
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </LearnerLayout>
    );
};

export default Subscription;
