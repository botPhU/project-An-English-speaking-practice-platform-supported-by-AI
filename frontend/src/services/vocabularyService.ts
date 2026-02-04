import axios from 'axios';
import { apiBaseUrl } from './api';

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

class VocabularyService {
  /**
   * Tạo bộ từ vựng mới
   */
  async createVocabularySet(setData: Omit<VocabularySet, 'id' | 'createdAt' | 'updatedAt'>): Promise<VocabularySet> {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/vocabulary/sets`,
        setData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating vocabulary set:', error);
      throw error;
    }
  }

  /**
   * Lấy tất cả bộ từ vựng của user
   */
  async getUserVocabularySets(): Promise<VocabularySet[]> {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/vocabulary/sets`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching vocabulary sets:', error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết một bộ từ vựng
   */
  async getVocabularySet(setId: string): Promise<VocabularySet> {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/vocabulary/sets/${setId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching vocabulary set:', error);
      throw error;
    }
  }

  /**
   * Cập nhật bộ từ vựng
   */
  async updateVocabularySet(setId: string, setData: Partial<VocabularySet>): Promise<VocabularySet> {
    try {
      const response = await axios.put(
        `${apiBaseUrl}/api/vocabulary/sets/${setId}`,
        setData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating vocabulary set:', error);
      throw error;
    }
  }

  /**
   * Xóa bộ từ vựng
   */
  async deleteVocabularySet(setId: string): Promise<void> {
    try {
      await axios.delete(
        `${apiBaseUrl}/api/vocabulary/sets/${setId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    } catch (error) {
      console.error('Error deleting vocabulary set:', error);
      throw error;
    }
  }

  /**
   * Thêm từ vựng vào bộ
   */
  async addWordToSet(setId: string, word: Vocabulary): Promise<Vocabulary> {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/vocabulary/sets/${setId}/words`,
        word,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding word to set:', error);
      throw error;
    }
  }

  /**
   * Xóa từ vựng khỏi bộ
   */
  async removeWordFromSet(setId: string, wordId: string): Promise<void> {
    try {
      await axios.delete(
        `${apiBaseUrl}/api/vocabulary/sets/${setId}/words/${wordId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    } catch (error) {
      console.error('Error removing word from set:', error);
      throw error;
    }
  }

  /**
   * Lấy thống kê từ vựng
   */
  async getWordStats(wordId: string): Promise<WordStats> {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/vocabulary/words/${wordId}/stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching word stats:', error);
      throw error;
    }
  }

  /**
   * Ghi nhận kết quả trả lời câu hỏi
   */
  async recordWordResponse(wordId: string, isCorrect: boolean): Promise<WordStats> {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/vocabulary/words/${wordId}/response`,
        { isCorrect },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error recording word response:', error);
      throw error;
    }
  }

  /**
   * Tạo quiz từ một bộ từ vựng
   */
  async generateQuiz(setId: string, questionCount: number = 10): Promise<QuizQuestion[]> {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/vocabulary/sets/${setId}/quiz`,
        {
          params: { questionCount },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  }

  /**
   * Ghi nhận kết quả bài quiz
   */
  async submitQuizResult(setId: string, results: { questionId: string; answer: string }[]): Promise<{
    score: number;
    totalQuestions: number;
    percentage: number;
    timeSpent: number;
  }> {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/vocabulary/sets/${setId}/quiz-result`,
        { results },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz result:', error);
      throw error;
    }
  }

  /**
   * Lấy từ cần ôn tập (spaced repetition)
   */
  async getWordsToReview(): Promise<Vocabulary[]> {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/vocabulary/review`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching words to review:', error);
      throw error;
    }
  }

  /**
   * Tìm kiếm từ vựng
   */
  async searchVocabulary(keyword: string, category?: string): Promise<Vocabulary[]> {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/vocabulary/search`,
        {
          params: {
            keyword,
            category,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error searching vocabulary:', error);
      throw error;
    }
  }

  /**
   * Lấy từ vựng theo category
   */
  async getVocabularyByCategory(category: string): Promise<Vocabulary[]> {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/vocabulary/category/${category}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching vocabulary by category:', error);
      throw error;
    }
  }
}

export default new VocabularyService();
