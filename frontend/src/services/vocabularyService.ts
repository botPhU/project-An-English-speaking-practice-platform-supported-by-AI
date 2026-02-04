import axios, { AxiosError } from 'axios';
import { apiBaseUrl } from './api';

// Validation utilities
const validateWord = (word: string): void => {
  if (!word || typeof word !== 'string') {
    throw new Error('Word must be a non-empty string');
  }
  if (word.length > 100) {
    throw new Error('Word must be less than 100 characters');
  }
};

const validateDefinition = (def: string): void => {
  if (!def || typeof def !== 'string') {
    throw new Error('Definition must be a non-empty string');
  }
  if (def.length < 10) {
    throw new Error('Definition must be at least 10 characters');
  }
  if (def.length > 500) {
    throw new Error('Definition must be less than 500 characters');
  }
};

const validateDifficulty = (difficulty: string): boolean => {
  return ['beginner', 'intermediate', 'advanced'].includes(difficulty);
};

const validateSetTitle = (title: string): void => {
  if (!title || typeof title !== 'string') {
    throw new Error('Set title must be a non-empty string');
  }
  if (title.length < 3) {
    throw new Error('Set title must be at least 3 characters');
  }
  if (title.length > 100) {
    throw new Error('Set title must be less than 100 characters');
  }
};

export interface Vocabulary {
  id: string;
  word: string;
  definition: string;
  pronunciation: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction';
  example: string;
  imageUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  relatedWords?: string[];
}

export interface VocabularySet {
  id: string;
  userId: string;
  title: string;
  description: string;
  vocabularies: Vocabulary[];
  totalWords: number;
  masteredWords: number;
  difficulty: string;
  createdAt: string;
  updatedAt: string;
}

export interface WordStats {
  wordId: string;
  word: string;
  correctAnswers: number;
  totalAttempts: number;
  lastReviewDate: string;
  nextReviewDate: string;
  difficulty: number;
  masteryLevel: number; // 0-100
}

export interface QuizQuestion {
  id: string;
  word: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'pronunciation';
  correctAnswer: string;
  options?: string[];
}

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

const handleApiError = (error: unknown, context: string): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const statusCode = axiosError.response?.status;
    const message = axiosError.response?.data as any;

    throw new Error(
      `[${context}] ${statusCode || 'Unknown'}: ${message?.message || error.message}`
    );
  }
  throw new Error(`Unexpected error in ${context}: ${error}`);
};

class VocabularyService {
  /**
   * Tạo bộ từ vựng mới với validation
   */
  async createVocabularySet(
    setData: Omit<VocabularySet, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<VocabularySet> {
    try {
      // Validate inputs
      validateSetTitle(setData.title);

      const response = await axios.post(`${apiBaseUrl}/api/vocabulary/sets`, setData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error && !error.message.includes('[')) {
        throw error; // Re-throw validation errors
      }
      handleApiError(error, 'creating vocabulary set');
    }
  }

  /**
   * Lấy tất cả bộ từ vựng của user
   */
  async getUserVocabularySets(): Promise<VocabularySet[]> {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/vocabulary/sets`, {
        headers: getAuthHeaders(),
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      handleApiError(error, 'fetching vocabulary sets');
    }
  }

  /**
   * Lấy chi tiết một bộ từ vựng
   */
  async getVocabularySet(setId: string): Promise<VocabularySet> {
    try {
      if (!setId?.trim()) {
        throw new Error('Set ID is required');
      }

      const response = await axios.get(`${apiBaseUrl}/api/vocabulary/sets/${setId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error && !error.message.includes('[')) {
        throw error;
      }
      handleApiError(error, 'fetching vocabulary set');
    }
  }

  /**
   * Cập nhật bộ từ vựng
   */
  async updateVocabularySet(
    setId: string,
    setData: Partial<VocabularySet>
  ): Promise<VocabularySet> {
    try {
      if (!setId?.trim()) {
        throw new Error('Set ID is required');
      }
      if (setData.title) {
        validateSetTitle(setData.title);
      }

      const response = await axios.put(
        `${apiBaseUrl}/api/vocabulary/sets/${setId}`,
        setData,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && !error.message.includes('[')) {
        throw error;
      }
      handleApiError(error, 'updating vocabulary set');
    }
  }

  /**
   * Xóa bộ từ vựng
   */
  async deleteVocabularySet(setId: string): Promise<void> {
    try {
      if (!setId?.trim()) {
        throw new Error('Set ID is required');
      }

      await axios.delete(`${apiBaseUrl}/api/vocabulary/sets/${setId}`, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      if (error instanceof Error && !error.message.includes('[')) {
        throw error;
      }
      handleApiError(error, 'deleting vocabulary set');
    }
  }

  /**
   * Thêm từ vựng vào bộ với validation
   */
  async addWordToSet(setId: string, word: Vocabulary): Promise<Vocabulary> {
    try {
      if (!setId?.trim()) {
        throw new Error('Set ID is required');
      }

      // Validate word data
      validateWord(word.word);
      validateDefinition(word.definition);
      if (!validateDifficulty(word.difficulty)) {
        throw new Error('Difficulty must be beginner, intermediate, or advanced');
      }

      const response = await axios.post(
        `${apiBaseUrl}/api/vocabulary/sets/${setId}/words`,
        word,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && !error.message.includes('[')) {
        throw error;
      }
      handleApiError(error, 'adding word to set');
    }
  }

  /**
   * Xóa từ vựng khỏi bộ
   */
  async removeWordFromSet(setId: string, wordId: string): Promise<void> {
    try {
      if (!setId?.trim() || !wordId?.trim()) {
        throw new Error('Set ID and Word ID are required');
      }

      await axios.delete(`${apiBaseUrl}/api/vocabulary/sets/${setId}/words/${wordId}`, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      if (error instanceof Error && !error.message.includes('[')) {
        throw error;
      }
      handleApiError(error, 'removing word from set');
    }
  }

  /**
   * Lấy thống kê từ vựng
   */
  async getWordStats(wordId: string): Promise<WordStats> {
    try {
      if (!wordId?.trim()) {
        throw new Error('Word ID is required');
      }

      const response = await axios.get(
        `${apiBaseUrl}/api/vocabulary/words/${wordId}/stats`,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && !error.message.includes('[')) {
        throw error;
      }
      handleApiError(error, 'fetching word stats');
    }
  }

  /**
   * Ghi nhận kết quả trả lời câu hỏi
   */
  async recordWordResponse(wordId: string, isCorrect: boolean): Promise<WordStats> {
    try {
      if (!wordId?.trim()) {
        throw new Error('Word ID is required');
      }
      if (typeof isCorrect !== 'boolean') {
        throw new Error('isCorrect must be a boolean');
      }

      const response = await axios.post(
        `${apiBaseUrl}/api/vocabulary/words/${wordId}/response`,
        { isCorrect },
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && !error.message.includes('[')) {
        throw error;
      }
      handleApiError(error, 'recording word response');
    }
  }

  /**
   * Tạo quiz từ một bộ từ vựng
   */
  async generateQuiz(setId: string, questionCount: number = 10): Promise<QuizQuestion[]> {
    try {
      if (!setId?.trim()) {
        throw new Error('Set ID is required');
      }
      if (questionCount < 1 || questionCount > 100) {
        throw new Error('Question count must be between 1 and 100');
      }

      const response = await axios.get(`${apiBaseUrl}/api/vocabulary/sets/${setId}/quiz`, {
        params: { questionCount },
        headers: getAuthHeaders(),
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      if (error instanceof Error && !error.message.includes('[')) {
        throw error;
      }
      handleApiError(error, 'generating quiz');
    }
  }

  /**
   * Ghi nhận kết quả bài quiz
   */
  async submitQuizResult(
    setId: string,
    results: { questionId: string; answer: string }[]
  ): Promise<{
    score: number;
    totalQuestions: number;
    percentage: number;
    timeSpent: number;
  }> {
    try {
      if (!setId?.trim()) {
        throw new Error('Set ID is required');
      }
      if (!Array.isArray(results) || results.length === 0) {
        throw new Error('Results must be a non-empty array');
      }

      const response = await axios.post(
        `${apiBaseUrl}/api/vocabulary/sets/${setId}/quiz-result`,
        { results },
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && !error.message.includes('[')) {
        throw error;
      }
      handleApiError(error, 'submitting quiz result');
    }
  }

  /**
   * Lấy từ cần ôn tập (spaced repetition)
   */
  async getWordsToReview(): Promise<Vocabulary[]> {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/vocabulary/review`, {
        headers: getAuthHeaders(),
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      handleApiError(error, 'fetching words to review');
    }
  }

  /**
   * Tìm kiếm từ vựng với validation
   */
  async searchVocabulary(keyword: string, category?: string): Promise<Vocabulary[]> {
    try {
      if (!keyword?.trim()) {
        throw new Error('Search keyword is required');
      }
      if (keyword.length < 2) {
        throw new Error('Search keyword must be at least 2 characters');
      }

      const response = await axios.get(`${apiBaseUrl}/api/vocabulary/search`, {
        params: {
          keyword: keyword.trim(),
          category,
        },
        headers: getAuthHeaders(),
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      if (error instanceof Error && !error.message.includes('[')) {
        throw error;
      }
      handleApiError(error, 'searching vocabulary');
    }
  }

  /**
   * Lấy từ vựng theo category
   */
  async getVocabularyByCategory(category: string): Promise<Vocabulary[]> {
    try {
      if (!category?.trim()) {
        throw new Error('Category is required');
      }

      const response = await axios.get(`${apiBaseUrl}/api/vocabulary/category/${category}`, {
        headers: getAuthHeaders(),
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      if (error instanceof Error && !error.message.includes('[')) {
        throw error;
      }
      handleApiError(error, 'fetching vocabulary by category');
    }
  }
}

export default new VocabularyService();
