import React, { useEffect, useCallback } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    icon?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showClose?: boolean;
    className?: string;
}

const SIZE_CLASSES = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]'
};

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    title,
    subtitle,
    icon,
    size = 'md',
    showClose = true,
    className = ''
}) => {
    // Handle ESC key
    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`
                relative w-full ${SIZE_CLASSES[size]} 
                bg-surface-dark rounded-xl border border-border-dark
                shadow-2xl shadow-black/50
                animate-in fade-in zoom-in-95 duration-200
                max-h-[90vh] overflow-hidden flex flex-col
                ${className}
            `}>
                {/* Header */}
                {(title || showClose) && (
                    <div className="flex items-center justify-between p-6 border-b border-border-dark shrink-0">
                        <div className="flex items-center gap-3">
                            {icon && (
                                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">{icon}</span>
                                </div>
                            )}
                            <div>
                                {title && <h2 className="text-lg font-bold text-white">{title}</h2>}
                                {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
                            </div>
                        </div>
                        {showClose && (
                            <button
                                onClick={onClose}
                                className="size-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <span className="material-symbols-outlined text-text-secondary">close</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Modal Body
export const ModalBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>{children}</div>
);

// Modal Footer
export const ModalFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`flex items-center justify-end gap-3 p-6 border-t border-border-dark ${className}`}>
        {children}
    </div>
);

export default Modal;
