import api from './api';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface PracticeSessionResponse {
    session_id: number;
    message: string;
}

export interface ChatResponse {
    response: string;
    session_id: number;
}

export interface SessionAnalysis {
    session_id: number;
    analysis: string;
    pronunciation_score?: number;
    grammar_score?: number;
    vocabulary_score?: number;
    fluency_score?: number;
    overall_score?: number;
}

export interface PronunciationAnalysis {
    pronunciation_score: number;
    clarity_score: number;
    accent_feedback?: string;
    problem_sounds?: Array<{
        original: string;
        should_be: string;
        phonetic?: string;
        tip: string;
    }>;
    well_pronounced?: string[];
    improvement_suggestions?: string[];
    overall_feedback?: string;
}

export interface QuickFeedback {
    score: number;
    clarity: number;
    issues: Array<{ original: string; tip: string }>;
    tip: string;
}

export interface VocabularyItem {
    word?: string;
    phrase?: string;
    ipa?: string;
    vietnamese?: string;
    meaning?: string;
    example: string;
    cefr?: string;
}

export interface VocabularyResponse {
    topic: string;
    vocabulary: {
        basic?: VocabularyItem[];
        intermediate?: VocabularyItem[];
        advanced?: VocabularyItem[];
        idioms?: VocabularyItem[];
        collocations?: VocabularyItem[];
    };
    message: string;
}

export const practiceService = {
    /**
     * Get vocabulary suggestions for a topic
     */
    getVocabulary: (topic: string) =>
        api.get<VocabularyResponse>(`/practice/vocabulary/${topic}`),

    /**
     * Start a new AI practice session
     */
    startSession: (userId: number, topic?: string, scenario?: string) =>
        api.post<PracticeSessionResponse>('/practice/start', {
            user_id: userId,
            topic,
            scenario
        }),

    /**
     * Send a message to the AI and get a response
     */
    chat: (sessionId: number, message: string) =>
        api.post<ChatResponse>('/practice/chat', {
            session_id: sessionId,
            message
        }),

    /**
     * Complete the session and get analysis/scores
     */
    completeSession: (sessionId: number) =>
        api.post<SessionAnalysis>('/practice/complete', {
            session_id: sessionId
        }),

    /**
     * Upload audio recording for a session
     */
    uploadAudio: async (sessionId: number, audioBlob: Blob) => {
        const formData = new FormData();
        formData.append('session_id', sessionId.toString());
        formData.append('audio', audioBlob, 'recording.webm');
        return api.post('/practice/upload-audio', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    /**
     * Get audio recording URL for a session (for mentors)
     */
    getSessionAudioUrl: (sessionId: number) =>
        `/api/practice/sessions/${sessionId}/audio`,

    /**
     * Analyze pronunciation of a transcript
     */
    analyzePronunciation: (transcript: string, expectedText?: string) =>
        api.post<PronunciationAnalysis>('/practice/analyze-pronunciation', {
            transcript,
            expected_text: expectedText
        }),

    /**
     * Get quick pronunciation feedback (for real-time use)
     */
    quickFeedback: (transcript: string) =>
        api.post<QuickFeedback>('/practice/quick-feedback', {
            transcript
        }),

    /**
     * Get pronunciation exercise
     */
    getPronunciationExercise: (difficulty: 'easy' | 'medium' | 'hard' = 'medium', focus?: string) =>
        api.get('/practice/pronunciation-exercise', {
            params: { difficulty, focus }
        }),
};

export default practiceService;
