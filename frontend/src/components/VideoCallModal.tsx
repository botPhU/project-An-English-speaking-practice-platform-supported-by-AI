import { useState, useEffect, useCallback } from 'react';

interface JitsiAPI {
    addEventListener: (event: string, handler: () => void) => void;
    removeEventListener: (event: string, handler: () => void) => void;
    dispose: () => void;
    executeCommand: (command: string, ...args: unknown[]) => void;
}

interface VideoCallModalProps {
    roomName: string;
    userName: string;
    userEmail?: string;
    onClose: () => void;
    isOpen: boolean;
}

declare global {
    interface Window {
        JitsiMeetExternalAPI: new (domain: string, options: unknown) => JitsiAPI;
    }
}

const VideoCallModal = ({ roomName, userName, userEmail, onClose, isOpen }: VideoCallModalProps) => {
    const [api, setApi] = useState<JitsiAPI | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const roomUrl = `https://meet.jit.si/${roomName}`;

    const copyRoomLink = () => {
        navigator.clipboard.writeText(roomUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const initJitsi = useCallback(() => {
        if (!window.JitsiMeetExternalAPI) {
            setError('Jitsi API not loaded');
            setLoading(false);
            return;
        }

        try {
            const jitsiApi = new window.JitsiMeetExternalAPI('meet.jit.si', {
                roomName: roomName,
                width: '100%',
                height: 550,
                parentNode: document.getElementById('jitsi-container'),
                userInfo: {
                    displayName: userName,
                    email: userEmail || ''
                },
                configOverwrite: {
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                    prejoinPageEnabled: false,
                    disableDeepLinking: true,
                    enableWelcomePage: false,
                    disableInviteFunctions: true,
                    defaultLanguage: 'vi'
                },
                interfaceConfigOverwrite: {
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'closedcaptions', 'desktop',
                        'fullscreen', 'fodeviceselection', 'hangup', 'chat',
                        'settings', 'videoquality', 'tileview', 'mute-everyone',
                        'participants-pane', 'recording'
                    ],
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    SHOW_BRAND_WATERMARK: false,
                    DEFAULT_BACKGROUND: '#1a2230',
                    TOOLBAR_ALWAYS_VISIBLE: true
                }
            });

            jitsiApi.addEventListener('videoConferenceLeft', () => {
                onClose();
            });

            jitsiApi.addEventListener('readyToClose', () => {
                onClose();
            });

            setApi(jitsiApi);
            setLoading(false);
        } catch (err) {
            console.error('Jitsi init error:', err);
            setError('Không thể khởi tạo cuộc gọi video');
            setLoading(false);
        }
    }, [roomName, userName, userEmail, onClose]);

    useEffect(() => {
        if (!isOpen) return;

        // Load Jitsi script if not already loaded
        if (!window.JitsiMeetExternalAPI) {
            const script = document.createElement('script');
            script.src = 'https://meet.jit.si/external_api.js';
            script.async = true;
            script.onload = initJitsi;
            script.onerror = () => {
                setError('Không thể tải Jitsi Meet');
                setLoading(false);
            };
            document.body.appendChild(script);
        } else {
            initJitsi();
        }

        return () => {
            if (api) {
                api.dispose();
            }
        };
    }, [isOpen, initJitsi, api]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a2230] rounded-2xl w-full max-w-5xl mx-4 overflow-hidden shadow-2xl border border-[#3e4854]/50">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-[#283039] border-b border-[#3e4854]/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-2xl">videocam</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Cuộc gọi Video</h3>
                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Đang kết nối...
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Copy Link Button */}
                        <button
                            onClick={copyRoomLink}
                            className="flex items-center gap-2 px-4 py-2 bg-[#3e4854]/50 hover:bg-[#3e4854] text-white rounded-lg transition-colors"
                            title="Copy link phòng"
                        >
                            <span className="material-symbols-outlined text-sm">
                                {copied ? 'check' : 'link'}
                            </span>
                            <span className="text-sm font-medium">
                                {copied ? 'Đã copy!' : 'Copy link'}
                            </span>
                        </button>
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {/* Video Container */}
                <div className="relative bg-[#0d1117]">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#0d1117] z-10">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-white text-lg font-medium">Đang kết nối cuộc gọi...</p>
                                <p className="text-gray-400 text-sm mt-2">Vui lòng cho phép truy cập camera và microphone</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="h-[550px] flex items-center justify-center bg-[#0d1117]">
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-red-500">error</span>
                                </div>
                                <p className="text-lg font-bold text-white mb-2">{error}</p>
                                <p className="text-gray-400 text-sm mb-6">Hãy thử tải lại trang hoặc kiểm tra kết nối mạng</p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => window.open(roomUrl, '_blank')}
                                        className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                                        Mở trong tab mới
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-3 bg-[#3e4854] text-white rounded-lg font-medium hover:bg-[#3e4854]/80"
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div id="jitsi-container" style={{ height: '550px' }}></div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-[#283039] border-t border-[#3e4854]/50 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        Được hỗ trợ bởi Jitsi Meet • End-to-end encrypted
                    </p>
                    <a
                        href={roomUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                        Mở trong tab mới
                        <span className="material-symbols-outlined text-xs">open_in_new</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default VideoCallModal;
