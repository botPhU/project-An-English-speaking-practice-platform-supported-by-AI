// Loading Spinner component
interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
}

export default function Loading({ size = 'md', message }: LoadingProps) {
    return (
        <div className={`loading loading-${size}`}>
            <div className="spinner"></div>
            {message && <p>{message}</p>}
        </div>
    );
}
