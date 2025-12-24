import { useState } from 'react';
import { AdminLayout } from '../../components/layout';

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
        <AdminLayout
            title="Lịch Sử Mua Hàng"
            subtitle="Xem chi tiết giao dịch mua gói dịch vụ của người dùng"
            icon="receipt_long"
            actions={
                <button className="bg-[#0bda5b] hover:bg-[#0bda5b]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-[#0bda5b]/25 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Xuất CSV
                </button>
            }
        >
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Tổng giao dịch</p>
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-md text-[20px]">
                                receipt_long
                            </span>
                        </div>
                        <p className="text-white tracking-tight text-3xl font-bold">{transactions.length}</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Doanh thu</p>
                            <span className="material-symbols-outlined text-[#0bda5b] bg-[#0bda5b]/10 p-1 rounded-md text-[20px]">
                                paid
                            </span>
                        </div>
                        <p className="text-white tracking-tight text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Đang xử lý</p>
                            <span className="material-symbols-outlined text-yellow-500 bg-yellow-500/10 p-1 rounded-md text-[20px]">
                                pending
                            </span>
                        </div>
                        <p className="text-white tracking-tight text-3xl font-bold">
                            {transactions.filter(t => t.status === 'pending').length}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Thất bại</p>
                            <span className="material-symbols-outlined text-red-500 bg-red-500/10 p-1 rounded-md text-[20px]">
                                error
                            </span>
                        </div>
                        <p className="text-white tracking-tight text-3xl font-bold">
                            {transactions.filter(t => t.status === 'failed').length}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between bg-[#283039]/50 p-4 rounded-xl border border-[#3b4754]">
                    <div className="flex flex-1 w-full gap-4 flex-col md:flex-row">
                        <div className="relative w-full md:w-48">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9dabb9]">
                                filter_list
                            </span>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg pl-11 pr-8 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="pending">Đang xử lý</option>
                                <option value="failed">Thất bại</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] pointer-events-none text-sm">
                                expand_more
                            </span>
                        </div>
                        <div className="relative w-full md:w-48">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9dabb9]">
                                inventory_2
                            </span>
                            <select
                                value={filterPackage}
                                onChange={(e) => setFilterPackage(e.target.value)}
                                className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg pl-11 pr-8 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                            >
                                <option value="all">Tất cả gói</option>
                                <option value="basic">Basic</option>
                                <option value="premium">Premium</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] pointer-events-none text-sm">
                                expand_more
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={dateRange.from}
                                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                className="px-4 py-2.5 rounded-lg border border-[#3b4754] bg-[#1a222a] text-white focus:ring-2 focus:ring-primary/50"
                            />
                            <span className="text-[#9dabb9]">đến</span>
                            <input
                                type="date"
                                value={dateRange.to}
                                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                className="px-4 py-2.5 rounded-lg border border-[#3b4754] bg-[#1a222a] text-white focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="rounded-xl border border-[#3b4754] bg-[#1a222a] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#283039] border-b border-[#3b4754]">
                                <tr>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Mã GD</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Người dùng</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Gói dịch vụ</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Số tiền</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Ngày</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Trạng thái</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#3b4754]">
                                {filteredTransactions.map((txn) => (
                                    <tr key={txn.id} className="group hover:bg-[#283039] transition-colors">
                                        <td className="p-4">
                                            <span className="font-mono text-sm font-semibold text-primary">{txn.id}</span>
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <p className="font-semibold text-white">{txn.user}</p>
                                                <p className="text-sm text-[#9dabb9]">{txn.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                                {txn.package}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-white">
                                            {formatCurrency(txn.amount)}
                                        </td>
                                        <td className="p-4 text-[#9dabb9]">{txn.date}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${txn.status === 'completed' ? 'bg-[#0bda5b]/20 text-[#0bda5b] ring-[#0bda5b]/30' :
                                                txn.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500 ring-yellow-500/30' :
                                                    'bg-red-500/20 text-red-500 ring-red-500/30'
                                                }`}>
                                                {txn.status === 'completed' ? 'Hoàn thành' :
                                                    txn.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors" title="Xem chi tiết">
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                </button>
                                                <button className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors" title="In hóa đơn">
                                                    <span className="material-symbols-outlined text-[20px]">receipt</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-[#3b4754] bg-[#1a222a] px-4 py-3 sm:px-6">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-[#9dabb9]">
                                    Hiển thị <span className="font-medium text-white">1</span> đến{' '}
                                    <span className="font-medium text-white">{filteredTransactions.length}</span> trong số{' '}
                                    <span className="font-medium text-white">{transactions.length}</span> giao dịch
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
                                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-[#9dabb9] ring-1 ring-inset ring-[#3b4754] hover:bg-[#283039]">
                                        2
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
}
