import React from 'react';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'inventory_2',
    title,
    description,
    action,
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
            <div className="size-16 rounded-2xl bg-surface-dark border border-border-dark flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-text-secondary opacity-50">{icon}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-text-secondary max-w-sm mb-4">{description}</p>
            )}
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
};

export default EmptyState;
