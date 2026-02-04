// Common Input component
interface InputProps {
    type?: 'text' | 'email' | 'password' | 'number';
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
}

export default function Input({
    type = 'text',
    placeholder,
    value,
    onChange,
    label,
    error,
    disabled = false,
    required = false,
    className = ''
}: InputProps) {
    return (
        <div className={`input-wrapper ${className}`}>
            {label && <label className="input-label">{label} {required && '*'}</label>}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={`input ${error ? 'input-error' : ''}`}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
}
