import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
                    <span className="material-symbols-outlined text-4xl text-red-400 mb-2">error</span>
                    <h3 className="text-lg font-bold text-white mb-2">Có lỗi xảy ra</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        {this.state.error?.message || 'Đã xảy ra lỗi không xác định'}
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
