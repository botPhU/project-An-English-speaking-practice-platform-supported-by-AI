import { useState, useEffect } from 'react';
import LearnerLayout from '../../layouts/LearnerLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface Payment {
    id: number;
    package_name: string;
    amount: number;
    currency: string;
    status: 'completed' | 'pending' | 'failed' | 'refunded';
    payment_method: string;
    transaction_id: string;
    created_at: string;
    expires_at?: string;
}

export default function PaymentHistory() {
    const { user } = useAuth();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

    useEffect(() => {
        if (user?.id) {
            fetchPayments();
        }
    }, [user?.id]);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/purchase/user/${user?.id}/history`);
            setPayments(response.data.payments || []);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            // Mock data for demo
            setPayments([
                {
                    id: 1,
                    package_name: 'Gói Premium - 1 tháng',
                    amount: 199000,
                    currency: 'VND',
                    status: 'completed',
                    payment_method: 'Momo',
                    transaction_id: 'TXN001234567',
                    created_at: '2026-01-15T10:30:00',
                    expires_at: '2026-02-15'
                },
                {
                    id: 2,
                    package_name: 'Khóa học Speaking Pro',
                    amount: 599000,
                    currency: 'VND',
                    status: 'completed',
                    payment_method: 'VNPay',
                    transaction_id: 'TXN001234568',
                    created_at: '2026-01-10T14:20:00'
                },
                {
                    id: 3,
                    package_name: 'Gói Premium - 3 tháng',
                    amount: 499000,
                    currency: 'VND',
                    status: 'pending',
                    payment_method: 'Bank Transfer',
                    transaction_id: 'TXN001234569',
                    created_at: '2026-02-01T09:00:00'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'failed': return 'bg-red-100 text-red-700';
            case 'refunded': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return '✓ Thành công';
            case 'pending': return '⏳ Đang xử lý';
            case 'failed': return '✗ Thất bại';
            case 'refunded': return '↩ Hoàn tiền';
            default: return status;
        }
    };

    const filteredPayments = payments.filter(p =>
        filter === 'all' || p.status === filter
    );

    const totalSpent = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <LearnerLayout>
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">💳 Lịch sử Thanh toán</h1>
                    <p className="text-gray-600">Quản lý các giao dịch và gói dịch vụ của bạn</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-4 text-white">
                        <p className="text-sm opacity-80">Tổng chi tiêu</p>
                        <p className="text-2xl font-bold">{formatCurrency(totalSpent, 'VND')}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-sm text-gray-500">Giao dịch</p>
                        <p className="text-2xl font-bold text-gray-800">{payments.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-sm text-gray-500">Thành công</p>
                        <p className="text-2xl font-bold text-green-600">
                            {payments.filter(p => p.status === 'completed').length}
                        </p>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex gap-2 mb-6">
                    {[
                        { id: 'all', label: 'Tất cả' },
                        { id: 'completed', label: '✓ Thành công' },
                        { id: 'pending', label: '⏳ Đang xử lý' }
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id as typeof filter)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === f.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Payment List */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : filteredPayments.length === 0 ? (
                        <div className="p-12 text-center">
                            <span className="text-6xl">📭</span>
                            <p className="mt-4 text-gray-500">Chưa có giao dịch nào</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredPayments.map((payment) => (
                                <div key={payment.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                                                💎
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">{payment.package_name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {payment.payment_method} • {formatDate(payment.created_at)}
                                                </p>
                                                <p className="text-xs text-gray-400">ID: {payment.transaction_id}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-800">
                                                {formatCurrency(payment.amount, payment.currency)}
                                            </p>
                                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(payment.status)}`}>
                                                {getStatusText(payment.status)}
                                            </span>
                                        </div>
                                    </div>
                                    {payment.expires_at && (
                                        <p className="mt-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                                            📅 Hết hạn: {payment.expires_at}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Help */}
                <div className="mt-6 bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-gray-600">
                        Cần hỗ trợ? <a href="/support" className="text-blue-600 hover:underline">Liên hệ chúng tôi</a>
                    </p>
                </div>
            </div>
        </LearnerLayout>
    );
}
