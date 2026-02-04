import React, { useState, useEffect } from 'react';
import progressTrackingService, {
  ProgressStreak,
  WeeklyProgress,
  LearningGoal,
} from '../../services/progressTrackingService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ProgressOverview.css';

interface ProgressOverviewProps {
  showGoals?: boolean;
  showStreak?: boolean;
  showWeeklyChart?: boolean;
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  showGoals = true,
  showStreak = true,
  showWeeklyChart = true,
}) => {
  const [streak, setStreak] = useState<ProgressStreak | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyProgress[]>([]);
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const [streakData, weeklyData, goalsData] = await Promise.all([
        progressTrackingService.getProgressStreak(),
        progressTrackingService.getWeeklyProgress(4),
        progressTrackingService.getLearningGoals('active'),
      ]);

      setStreak(streakData);
      setWeeklyData(weeklyData);
      setGoals(goalsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      await progressTrackingService.completeLearningGoal(goalId);
      fetchProgressData();
    } catch (err) {
      console.error('Error completing goal:', err);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await progressTrackingService.deleteLearningGoal(goalId);
      fetchProgressData();
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  if (loading) {
    return <div className="progress-overview loading">Loading progress data...</div>;
  }

  if (error) {
    return <div className="progress-overview error">Error: {error}</div>;
  }

  return (
    <div className="progress-overview">
      <div className="progress-container">
        {/* Streak Section */}
        {showStreak && streak && (
          <div className="streak-section card">
            <h3>🔥 Learning Streak</h3>
            <div className="streak-stats">
              <div className="stat-item">
                <div className="stat-label">Current Streak</div>
                <div className="stat-value">{streak.currentStreak}</div>
                <div className="stat-unit">days</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Longest Streak</div>
                <div className="stat-value">{streak.longestStreak}</div>
                <div className="stat-unit">days</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Total Active Days</div>
                <div className="stat-value">{streak.totalDaysActive}</div>
                <div className="stat-unit">days</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Last Activity</div>
                <div className="stat-value">
                  {new Date(streak.lastActivityDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Progress Chart */}
        {showWeeklyChart && weeklyData.length > 0 && (
          <div className="chart-section card">
            <h3>📊 Weekly Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="speaking" fill="#FF6B6B" />
                <Bar dataKey="listening" fill="#4ECDC4" />
                <Bar dataKey="reading" fill="#45B7D1" />
                <Bar dataKey="writing" fill="#FFA07A" />
                <Bar dataKey="vocabulary" fill="#98D8C8" />
                <Bar dataKey="grammar" fill="#F7DC6F" />
              </BarChart>
            </ResponsiveContainer>
            <div className="weekly-summary">
              {weeklyData.map((week) => (
                <div key={week.week} className="week-item">
                  <span className="week-label">{week.week}</span>
                  <span className="week-points">
                    {week.totalPoints} pts • {week.lessonsCompleted} lessons • {week.practiceHours}h
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Goals Section */}
        {showGoals && goals.length > 0 && (
          <div className="goals-section card">
            <h3>🎯 Learning Goals</h3>
            <div className="goals-list">
              {goals.map((goal) => (
                <div key={goal.id} className="goal-item">
                  <div className="goal-header">
                    <h4>{goal.title}</h4>
                    <span className="goal-category">{goal.category}</span>
                  </div>
                  <p className="goal-description">{goal.description}</p>
                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="progress-text">
                      {goal.currentValue} / {goal.targetValue}
                    </span>
                  </div>
                  <div className="goal-footer">
                    <span className="due-date">Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                    <div className="goal-actions">
                      <button
                        className="btn-complete"
                        onClick={() => handleCompleteGoal(goal.id)}
                      >
                        ✓ Complete
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        × Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {goals.length === 0 && showGoals && (
          <div className="empty-state card">
            <p>No active learning goals yet. Create one to get started! 🚀</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressOverview;
