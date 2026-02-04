import axios, { AxiosError } from 'axios';
import { apiBaseUrl } from './api';

// Custom error class for better error handling
class ProgressTrackingError extends Error {
  constructor(message: string, public code: string, public statusCode?: number) {
    super(message);
    this.name = 'ProgressTrackingError';
  }
}

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

// Helper function to get auth headers
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

// Helper function to handle API errors
const handleApiError = (error: unknown, context: string): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const statusCode = axiosError.response?.status;
    const message = axiosError.response?.data as any;

    throw new ProgressTrackingError(
      message?.message || `Error ${context}`,
      `ERROR_${context.toUpperCase()}`,
      statusCode
    );
  }
  throw new Error(`Unexpected error in ${context}: ${error}`);
};

class ProgressTrackingService {
  /**
   * Lấy toàn bộ dữ liệu tiến độ của user
   */
  async getUserProgressMetrics(): Promise<ProgressMetric[]> {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/progress/metrics`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'fetching progress metrics');
    }
  }

  /**
   * Lấy tiến độ theo tuần
   */
  async getWeeklyProgress(weeks: number = 4): Promise<WeeklyProgress[]> {
    try {
      if (weeks < 1 || weeks > 52) {
        throw new ProgressTrackingError('Weeks must be between 1 and 52', 'INVALID_WEEKS_RANGE');
      }

      const response = await axios.get(`${apiBaseUrl}/api/progress/weekly`, {
        params: { weeks },
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'fetching weekly progress');
    }
  }

  /**
   * Lấy thông tin streak (dãy học liên tục)
   */
  async getProgressStreak(): Promise<ProgressStreak> {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/progress/streak`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'fetching progress streak');
    }
  }

  /**
   * Lấy danh sách mục tiêu học tập với filtering
   */
  async getLearningGoals(status?: 'active' | 'completed' | 'abandoned'): Promise<LearningGoal[]> {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/progress/goals`, {
        params: status ? { status } : {},
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'fetching learning goals');
    }
  }

  /**
   * Tạo mục tiêu học tập mới với validation
   */
  async createLearningGoal(
    goalData: Omit<LearningGoal, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<LearningGoal> {
    try {
      // Validate input
      if (!goalData.title?.trim()) {
        throw new ProgressTrackingError('Goal title is required', 'INVALID_TITLE');
      }
      if (goalData.targetValue <= 0) {
        throw new ProgressTrackingError('Target value must be positive', 'INVALID_TARGET_VALUE');
      }

      const response = await axios.post(`${apiBaseUrl}/api/progress/goals`, goalData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'creating learning goal');
    }
  }

  /**
   * Cập nhật mục tiêu học tập
   */
  async updateLearningGoal(
    goalId: string,
    goalData: Partial<LearningGoal>
  ): Promise<LearningGoal> {
    try {
      if (!goalId?.trim()) {
        throw new ProgressTrackingError('Goal ID is required', 'INVALID_GOAL_ID');
      }

      const response = await axios.put(
        `${apiBaseUrl}/api/progress/goals/${goalId}`,
        goalData,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'updating learning goal');
    }
  }

  /**
   * Xóa mục tiêu học tập
   */
  async deleteLearningGoal(goalId: string): Promise<void> {
    try {
      if (!goalId?.trim()) {
        throw new ProgressTrackingError('Goal ID is required', 'INVALID_GOAL_ID');
      }

      await axios.delete(`${apiBaseUrl}/api/progress/goals/${goalId}`, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      handleApiError(error, 'deleting learning goal');
    }
  }

  /**
   * Hoàn thành mục tiêu học tập
   */
  async completeLearningGoal(goalId: string): Promise<LearningGoal> {
    try {
      if (!goalId?.trim()) {
        throw new ProgressTrackingError('Goal ID is required', 'INVALID_GOAL_ID');
      }

      const response = await axios.patch(
        `${apiBaseUrl}/api/progress/goals/${goalId}/complete`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'completing learning goal');
    }
  }

  /**
   * Ghi nhận một metric tiến độ
   */
  async recordProgressMetric(
    metric: Omit<ProgressMetric, 'id' | 'userId'>
  ): Promise<ProgressMetric> {
    try {
      if (!metric.metric?.trim()) {
        throw new ProgressTrackingError('Metric name is required', 'INVALID_METRIC_NAME');
      }
      if (metric.value < 0) {
        throw new ProgressTrackingError('Metric value cannot be negative', 'INVALID_METRIC_VALUE');
      }

      const response = await axios.post(`${apiBaseUrl}/api/progress/metrics`, metric, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'recording progress metric');
    }
  }

  /**
   * Lấy thống kê tiến độ theo từng kỹ năng
   */
  async getSkillMetrics(
    category: string,
    daysRange: number = 30
  ): Promise<{ date: string; value: number }[]> {
    try {
      if (!category?.trim()) {
        throw new ProgressTrackingError('Category is required', 'INVALID_CATEGORY');
      }
      if (daysRange < 1 || daysRange > 365) {
        throw new ProgressTrackingError('Days range must be between 1 and 365', 'INVALID_DAYS_RANGE');
      }

      const response = await axios.get(`${apiBaseUrl}/api/progress/skills/${category}`, {
        params: { daysRange },
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'fetching skill metrics');
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
      const response = await axios.get(`${apiBaseUrl}/api/progress/comparison`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'fetching progress comparison');
    }
  }

  /**
   * Xuất báo cáo tiến độ (PDF hoặc CSV)
   */
  async exportProgressReport(
    format: 'pdf' | 'csv',
    dateRange?: { from: string; to: string }
  ): Promise<Blob> {
    try {
      if (!['pdf', 'csv'].includes(format)) {
        throw new ProgressTrackingError('Format must be pdf or csv', 'INVALID_FORMAT');
      }

      const response = await axios.get(`${apiBaseUrl}/api/progress/export`, {
        params: {
          format,
          ...dateRange,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'exporting progress report');
    }
  }
}

export default new ProgressTrackingService();
export { ProgressTrackingError };
