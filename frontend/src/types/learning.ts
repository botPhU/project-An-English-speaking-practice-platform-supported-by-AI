// Types cho Learning & Practice
export interface Topic {
    id: string;
    name: string;
    category: 'travel' | 'business' | 'daily_life' | 'healthcare' | 'tourism' | 'other';
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced';
}

export interface PracticeSession {
    id: string;
    learnerId: string;
    topicId: string;
    partnerId?: string; // other learner or AI
    startTime: Date;
    endTime?: Date;
    pronunciationScore?: number;
    grammarFeedback?: string[];
    vocabularyFeedback?: string[];
}

export interface LearningPath {
    id: string;
    learnerId: string;
    topics: Topic[];
    completedTopics: string[];
    currentTopicId: string;
    progress: number; // percentage
}

export interface Progress {
    learnerId: string;
    dailyStreak: number;
    totalPracticeTime: number; // minutes
    averagePronunciationScore: number;
    completedChallenges: number;
    leaderboardRank?: number;
}
