import React, { useRef, useEffect, useState } from 'react';

interface VoiceWaveformProps {
    isRecording: boolean;
    audioStream?: MediaStream | null;
}

/**
 * Real-time voice waveform visualization
 * Uses Web Audio API AnalyserNode for frequency data
 */
const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ isRecording, audioStream }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

    useEffect(() => {
        if (isRecording && audioStream) {
            // Create audio context and analyser
            const ctx = new AudioContext({});
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;

            const source = ctx.createMediaStreamSource(audioStream);
            source.connect(analyser);

            analyserRef.current = analyser;
            setAudioContext(ctx);

            // Start visualization
            draw();
        } else {
            // Stop and cleanup
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (audioContext) {
                audioContext.close();
                setAudioContext(null);
            }
            // Clear canvas
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isRecording, audioStream]);

    const draw = () => {
        const canvas = canvasRef.current;
        const analyser = analyserRef.current;

        if (!canvas || !analyser) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const render = () => {
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            // Create gradient
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
            gradient.addColorStop(0, '#10b981');
            gradient.addColorStop(0.5, '#6366f1');
            gradient.addColorStop(1, '#a855f7');

            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

                // Mirror effect from center
                const centerY = canvas.height / 2;

                ctx.fillStyle = gradient;
                ctx.fillRect(x, centerY - barHeight / 2, barWidth - 1, barHeight);

                x += barWidth;
            }

            animationRef.current = requestAnimationFrame(render);
        };

        render();
    };

    return (
        <div className="w-full h-16 bg-[#1a222a] rounded-xl overflow-hidden border border-[#3b4754]/50">
            {isRecording ? (
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={64}
                    className="w-full h-full"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="flex gap-1 items-center">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1 bg-[#3b4754] rounded-full"
                                style={{
                                    height: `${8 + Math.sin(i * 0.5) * 8}px`,
                                    opacity: 0.5
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoiceWaveform;
