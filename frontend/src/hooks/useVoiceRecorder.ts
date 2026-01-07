import { useState, useRef, useCallback } from 'react';

interface UseVoiceRecorderReturn {
    isRecording: boolean;
    audioBlob: Blob | null;
    audioUrl: string | null;
    transcript: string;
    isTranscribing: boolean;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    resetRecording: () => void;
    error: string | null;
}

/**
 * Custom hook for voice recording with speech-to-text
 * Uses Web Audio API for recording and Web Speech API for transcription
 */
export function useVoiceRecorder(): UseVoiceRecorderReturn {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [transcript, setTranscript] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const startRecording = useCallback(async () => {
        try {
            setError(null);
            setTranscript('');
            audioChunksRef.current = [];

            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });

            // Setup MediaRecorder for audio
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start(100); // Collect data every 100ms

            // Setup Speech Recognition for real-time transcription
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onresult = (event) => {
                    let interimTranscript = '';
                    let finalTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcriptPart = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcriptPart + ' ';
                        } else {
                            interimTranscript += transcriptPart;
                        }
                    }

                    setTranscript(prev => {
                        const base = prev.replace(/\s*\[.*\]$/, '');
                        if (finalTranscript) {
                            return base + finalTranscript;
                        }
                        return base + (interimTranscript ? ` [${interimTranscript}]` : '');
                    });
                };

                recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    if (event.error !== 'aborted') {
                        setError(`Speech recognition error: ${event.error}`);
                    }
                };

                recognitionRef.current = recognition;
                recognition.start();
                setIsTranscribing(true);
            }

            setIsRecording(true);
        } catch (err) {
            console.error('Error starting recording:', err);
            setError('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.');
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }

        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsTranscribing(false);
            // Clean up transcript - remove interim markers
            setTranscript(prev => prev.replace(/\s*\[.*\]$/, '').trim());
        }
    }, [isRecording]);

    const resetRecording = useCallback(() => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioBlob(null);
        setAudioUrl(null);
        setTranscript('');
        setError(null);
        audioChunksRef.current = [];
    }, [audioUrl]);

    return {
        isRecording,
        audioBlob,
        audioUrl,
        transcript,
        isTranscribing,
        startRecording,
        stopRecording,
        resetRecording,
        error,
    };
}

// TypeScript declarations for Web Speech API
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}

export default useVoiceRecorder;
