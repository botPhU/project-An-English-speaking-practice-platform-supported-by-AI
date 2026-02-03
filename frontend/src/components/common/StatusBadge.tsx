import React from 'react';

type StatusType = 'online' | 'offline' | 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'success' | 'warning' | 'error';

interface StatusBadgeProps {
    status: StatusType;
    label?: string;
    showDot?: boolean;
    size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<StatusType, { bg: string; text: string; dot: string; defaultLabel: string }> = {
    online: { bg: 'bg-green-500/10', text: 'text-green-500', dot: 'bg-green-500', defaultLabel: 'Trực tuyến' },
    offline: { bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400', defaultLabel: 'Ngoại tuyến' },
    active: { bg: 'bg-green-500/10', text: 'text-green-500', dot: 'bg-green-500', defaultLabel: 'Hoạt động' },
    inactive: { bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400', defaultLabel: 'Không hoạt động' },
    pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', dot: 'bg-yellow-500', defaultLabel: 'Đang chờ' },
    approved: { bg: 'bg-green-500/10', text: 'text-green-500', dot: 'bg-green-500', defaultLabel: 'Đã duyệt' },
    rejected: { bg: 'bg-red-500/10', text: 'text-red-500', dot: 'bg-red-500', defaultLabel: 'Từ chối' },
    success: { bg: 'bg-green-500/10', text: 'text-green-500', dot: 'bg-green-500', defaultLabel: 'Thành công' },
    warning: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', dot: 'bg-yellow-500', defaultLabel: 'Cảnh báo' },
    error: { bg: 'bg-red-500/10', text: 'text-red-500', dot: 'bg-red-500', defaultLabel: 'Lỗi' }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    label,
    showDot = true,
    size = 'md'
}) => {
    const config = STATUS_CONFIG[status];
    const displayLabel = label || config.defaultLabel;

    const sizeClasses = size === 'sm'
        ? 'px-2 py-0.5 text-xs'
        : 'px-2.5 py-1 text-xs';

    const dotSize = size === 'sm' ? 'size-1' : 'size-1.5';

    return (
        <span className={`
            inline-flex items-center gap-1.5 rounded-full font-bold
            ${config.bg} ${config.text} ${sizeClasses}
        `}>
            {showDot && <span className={`${dotSize} rounded-full ${config.dot}`} />}
            {displayLabel}
        </span>
    );
};

export default StatusBadge;
