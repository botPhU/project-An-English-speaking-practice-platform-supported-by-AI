import { useState } from 'react';

// Mock data for transactions
const mockTransactions = [
    { id: 'TXN001', user: 'Nguyễn Văn A', email: 'nguyenvana@email.com', package: 'Premium 1 tháng', amount: 299000, date: '2024-12-20', status: 'completed' },
    { id: 'TXN002', user: 'Trần Thị B', email: 'tranthib@email.com', package: 'Basic 3 tháng', amount: 449000, date: '2024-12-19', status: 'completed' },
    { id: 'TXN003', user: 'Lê Văn C', email: 'levanc@email.com', package: 'Premium 6 tháng', amount: 1499000, date: '2024-12-19', status: 'pending' },
    { id: 'TXN004', user: 'Phạm Thị D', email: 'phamthid@email.com', package: 'Basic 1 tháng', amount: 149000, date: '2024-12-18', status: 'failed' },
    { id: 'TXN005', user: 'Hoàng Văn E', email: 'hoangvane@email.com', package: 'Premium 1 năm', amount: 2699000, date: '2024-12-18', status: 'completed' },
];

export default function PurchaseHistory() {
    const [transactions] = useState(mockTransactions);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPackage, setFilterPackage] = useState('all');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const filteredTransactions = transactions.filter(txn => {
        const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
        const matchesPackage = filterPackage === 'all' || txn.package.toLowerCase().includes(filterPackage.toLowerCase());
        return matchesStatus && matchesPackage;
    });

    const totalRevenue = transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#111418] p-6 font-[Manrope,sans-serif]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-[#111418] dark:text-white mb-2">
                        Lịch Sử Mua Hàng
                    </h1>
                    <p className="text-[#637588] dark:text-[#9dabb9]">
                        Xem chi tiết giao dịch mua gói dịch vụ của người dùng
                    </p>
                </div>
                <button className="mt-4 md:mt-0 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined">download</span>
                    Xuất CSV
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-[#2b8cee]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#2b8cee]">receipt_long</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">{transactions.length}</p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Tổng giao dịch</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-500">paid</span>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-[#111418] dark:text-white">{formatCurrency(totalRevenue)}</p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Doanh thu</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-yellow-500">pending</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">
                                {transactions.filter(t => t.status === 'pending').length}
                            </p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Đang xử lý</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-red-500">error</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">
                                {transactions.filter(t => t.status === 'failed').length}
                            </p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Thất bại</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-[#1c2127] rounded-xl p-4 mb-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                <div className="flex flex-col md:flex-row gap-4">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3 rounded-lg border border-[#dce0e5] dark:border-[#3b4754] bg-[#f6f7f8] dark:bg-[#111418] text-[#111418] dark:text-white focus:ring-2 focus:ring-[#2b8cee]/50"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="pending">Đang xử lý</option>
                        <option value="failed">Thất bại</option>
                    </select>
                    <select
                        value={filterPackage}
                        onChange={(e) => setFilterPackage(e.target.value)}
                        className="px-4 py-3 rounded-lg border border-[#dce0e5] dark:border-[#3b4754] bg-[#f6f7f8] dark:bg-[#111418] text-[#111418] dark:text-white focus:ring-2 focus:ring-[#2b8cee]/50"
                    >
                        <option value="all">Tất cả gói</option>
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                    </select>
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={dateRange.from}
                            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                            className="px-4 py-3 rounded-lg border border-[#dce0e5] dark:border-[#3b4754] bg-[#f6f7f8] dark:bg-[#111418] text-[#111418] dark:text-white focus:ring-2 focus:ring-[#2b8cee]/50"
                        />
                        <span className="text-[#637588]">đến</span>
                        <input
                            type="date"
                            value={dateRange.to}
                            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                            className="px-4 py-3 rounded-lg border border-[#dce0e5] dark:border-[#3b4754] bg-[#f6f7f8] dark:bg-[#111418] text-[#111418] dark:text-white focus:ring-2 focus:ring-[#2b8cee]/50"
                        />
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white dark:bg-[#1c2127] rounded-xl shadow-sm border border-[#dce0e5] dark:border-[#3b4754] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#f6f7f8] dark:bg-[#111418] border-b border-[#dce0e5] dark:border-[#3b4754]">
                            <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Mã GD</th>
                            <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Người dùng</th>
                            <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Gói dịch vụ</th>
                            <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Số tiền</th>
                            <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Ngày</th>
                            <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Trạng thái</th>
                            <th className="text-right px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((txn) => (
                            <tr key={txn.id} className="border-b border-[#dce0e5] dark:border-[#3b4754] hover:bg-[#f6f7f8] dark:hover:bg-[#111418]/50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="font-mono text-sm font-semibold text-[#2b8cee]">{txn.id}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-semibold text-[#111418] dark:text-white">{txn.user}</p>
                                        <p className="text-sm text-[#637588] dark:text-[#9dabb9]">{txn.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-[#2b8cee]/10 text-[#2b8cee] text-sm font-medium">
                                        {txn.package}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-[#111418] dark:text-white">
                                    {formatCurrency(txn.amount)}
                                </td>
                                <td className="px-6 py-4 text-[#637588] dark:text-[#9dabb9]">{txn.date}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${txn.status === 'completed' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                                            txn.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                                                'bg-red-500/10 text-red-600 dark:text-red-400'
                                        }`}>
                                        {txn.status === 'completed' ? 'Hoàn thành' :
                                            txn.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 hover:bg-[#2b8cee]/10 rounded-lg transition-colors text-[#637588] hover:text-[#2b8cee]">
                                            <span className="material-symbols-outlined">visibility</span>
                                        </button>
                                        <button className="p-2 hover:bg-[#2b8cee]/10 rounded-lg transition-colors text-[#637588] hover:text-[#2b8cee]">
                                            <span className="material-symbols-outlined">receipt</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#dce0e5] dark:border-[#3b4754]">
                    <p className="text-sm text-[#637588] dark:text-[#9dabb9]">
                        Hiển thị 1-{filteredTransactions.length} của {transactions.length} giao dịch
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 rounded-lg border border-[#dce0e5] dark:border-[#3b4754] text-[#637588] hover:bg-[#f6f7f8] dark:hover:bg-[#111418] transition-colors">
                            Trước
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-[#2b8cee] text-white font-medium">1</button>
                        <button className="px-4 py-2 rounded-lg border border-[#dce0e5] dark:border-[#3b4754] text-[#637588] hover:bg-[#f6f7f8] dark:hover:bg-[#111418] transition-colors">
                            Sau
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
