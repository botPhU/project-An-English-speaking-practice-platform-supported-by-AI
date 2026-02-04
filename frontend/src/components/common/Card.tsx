import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    onClick?: () => void;
}

const PADDING_CLASSES = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
};

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'md',
    hover = false,
    onClick
}) => {
    return (
        <div
            onClick={onClick}
            className={`
                bg-surface-dark rounded-xl border border-border-dark
                ${PADDING_CLASSES[padding]}
                ${hover ? 'hover:border-primary/50 cursor-pointer transition-colors' : ''}
                ${onClick ? 'cursor-pointer' : ''}
                ${className}
            `}
        >
            {children}
        </div>
    );
};

// Card Header
interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
    actions?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', actions }) => (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
        <div>{children}</div>
        {actions && <div>{actions}</div>}
    </div>
);

// Card Title
interface CardTitleProps {
    children: React.ReactNode;
    subtitle?: string;
    icon?: string;
    iconColor?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, subtitle, icon, iconColor = 'text-primary' }) => (
    <div className="flex items-center gap-3">
        {icon && (
            <div className={`size-10 rounded-lg bg-primary/10 flex items-center justify-center ${iconColor}`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
        )}
        <div>
            <h3 className="text-lg font-bold text-white">{children}</h3>
            {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
        </div>
    </div>
);

// Card Content
export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={className}>{children}</div>
);

// Card Footer
export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`mt-4 pt-4 border-t border-border-dark ${className}`}>{children}</div>
);

export default Card;
