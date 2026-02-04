import React, { useState, useRef, useCallback } from 'react';

interface AvatarUploadProps {
    currentAvatar?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg';
    onUpload: (file: File) => Promise<string>;
    onError?: (error: string) => void;
    className?: string;
}

const SIZE_CLASSES = {
    sm: 'size-16',
    md: 'size-24',
    lg: 'size-32'
};

const ICON_SIZES = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
};

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const AvatarUpload: React.FC<AvatarUploadProps> = ({
    currentAvatar,
    name = 'User',
    size = 'md',
    onUpload,
    onError,
    className = ''
}) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const validateFile = (file: File): string | null => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return 'Chỉ chấp nhận file ảnh (PNG, JPG, GIF, WebP)';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'Kích thước file không được vượt quá 5MB';
        }
        return null;
    };

    const handleFile = useCallback(async (file: File) => {
        const error = validateFile(file);
        if (error) {
            onError?.(error);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        try {
            setUploading(true);
            await onUpload(file);
        } catch (err) {
            onError?.('Lỗi khi upload ảnh. Vui lòng thử lại.');
            setPreview(null);
        } finally {
            setUploading(false);
        }
    }, [onUpload, onError]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const displayImage = preview || currentAvatar;

    return (
        <div className={`relative inline-block ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                onChange={handleInputChange}
                className="hidden"
            />

            <div
                onClick={handleClick}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                    ${SIZE_CLASSES[size]} 
                    rounded-full cursor-pointer relative overflow-hidden
                    transition-all duration-200
                    ${dragActive ? 'ring-4 ring-primary ring-opacity-50 scale-105' : ''}
                    ${uploading ? 'opacity-50' : 'hover:opacity-90'}
                    group
                `}
            >
                {displayImage ? (
                    <div
                        className="w-full h-full bg-center bg-cover"
                        style={{ backgroundImage: `url("${displayImage}")` }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                        {getInitials(name)}
                    </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className={`material-symbols-outlined text-white ${ICON_SIZES[size]}`}>
                        photo_camera
                    </span>
                </div>

                {/* Loading spinner */}
                {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                    </div>
                )}
            </div>

            {/* Camera button */}
            <button
                onClick={handleClick}
                disabled={uploading}
                className={`
                    absolute bottom-0 right-0 
                    p-1.5 rounded-full 
                    bg-primary text-white 
                    hover:bg-primary/80 
                    border-2 border-[#1a222a]
                    transition-colors
                    disabled:opacity-50
                    flex items-center justify-center
                `}
                title="Đổi ảnh đại diện"
            >
                <span className={`material-symbols-outlined ${ICON_SIZES[size]}`}>
                    {uploading ? 'sync' : 'photo_camera'}
                </span>
            </button>
        </div>
    );
};

export default AvatarUpload;
