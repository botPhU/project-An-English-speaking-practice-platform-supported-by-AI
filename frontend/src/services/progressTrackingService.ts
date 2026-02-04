import axios from 'axios';
import { apiBaseUrl } from './api';

export interface ProgressMetric {
  id: string;
  userId: string;
  metric: string;
  value: number;
  date: string;
  category: 'speaking' | 'listening' | 'reading' | 'writing' | 'vocabulary' | 'grammar';
}

export interface WeeklyProgress {
  week: string;
  metrics: {
    speaking: number;
    listening: number;
    reading: number;
    writing: number;
    vocabulary: number;
    grammar: number;
  };
  totalPoints: number;
  lessonsCompleted: number;
  practiceHours: number;
}

export interface ProgressStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  totalDaysActive: number;
}

export interface LearningGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  category: string;
  dueDate: string;
  status: 'active' | 'completed' | 'abandoned';
  createdAt: string;
  updatedAt: string;
}

class ProgressTrackingService {
  /**
   * Lấy toàn bộ dữ liệu tiến độ của user
   */
  async getUserProgressMetrics(): Promise<ProgressMetric[]> {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/progress/metrics`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching progress metrics:', error);
      throw error;
    }
  }

  /**
   * Lấy tiến độ theo tuần
   */
  async getWeeklyProgress(weeks: number = 4): Promise<WeeklyProgress[]> {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/progress/weekly`,
        {
          params: { weeks },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly progress:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin streak (dãy học liên tục)
   */
  async getProgressStreak(): Promise<ProgressStreak> {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/progress/streak`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching progress streak:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách mục tiêu học tập
   */
  async getLearningGoals(status?: string): Promise<LearningGoal[]> {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/progress/goals`,
        {
          params: status ? { status } : {},
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching learning goals:', error);
      throw error;
    }
  }

  /**
   * Tạo mục tiêu học tập mới
   */
  async createLearningGoal(goalData: Omit<LearningGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<LearningGoal> {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/progress/goals`,
        goalData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating learning goal:', error);
      throw error;
    }
  }

  /**
   * Cập nhật mục tiêu học tập
   */
  async updateLearningGoal(goalId: string, goalData: Partial<LearningGoal>): Promise<LearningGoal> {
    try {
      const response = await axios.put(
        `${apiBaseUrl}/api/progress/goals/${goalId}`,
        goalData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating learning goal:', error);
      throw error;
    }
  }

  /**
   * Xóa mục tiêu học tập
   */
  async deleteLearningGoal(goalId: string): Promise<void> {
    try {
      await axios.delete(
        `${apiBaseUrl}/api/progress/goals/${goalId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    } catch (error) {
      console.error('Error deleting learning goal:', error);
      throw error;
    }
  }

  /**
   * Hoàn thành mục tiêu học tập
   */
  async completeLearningGoal(goalId: string): Promise<LearningGoal> {
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/api/progress/goals/${goalId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error completing learning goal:', error);
      throw error;
    }
  }

  /**
   * Ghi nhận một metric tiến độ
   */
  async recordProgressMetric(metric: Omit<ProgressMetric, 'id' | 'userId'>): Promise<ProgressMetric> {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/progress/metrics`,
        metric,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error recording progress metric:', error);
      throw error;
    }
  }

  /**
   * Lấy thống kê tiến độ theo từng kỹ năng
   */
  async getSkillMetrics(category: string, daysRange: number = 30): Promise<{ date: string; value: number }[]> {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/progress/skills/${category}`,
        {
          params: { daysRange },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching skill metrics:', error);
      throw error;
    }
  }

  /**
   * Lấy dữ liệu so sánh: tiến độ của user vs trung bình
   */
  async getProgressComparison(): Promise<{
    userProgress: number;
    averageProgress: number;
    percentile: number;
  }> {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/progress/comparison`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching progress comparison:', error);
      throw error;
    }
  }

  /**
   * Xuất báo cáo tiến độ (PDF hoặc CSV)
   */
  async exportProgressReport(format: 'pdf' | 'csv', dateRange?: { from: string; to: string }): Promise<Blob> {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/progress/export`,
        {
          params: {
            format,
            ...dateRange,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error exporting progress report:', error);
      throw error;
    }
  }
}

export default new ProgressTrackingService();
