import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp, TrendingDown, Lightbulb, AlertTriangle } from 'lucide-react';

interface Insight {
  id: string;
  type: 'success' | 'warning' | 'alert' | 'recommendation';
  title: string;
  description: string;
  metric: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  action?: string;
}

export default function PerformanceInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const mockInsights: Insight[] = [
        {
          id: '1',
          type: 'success',
          title: 'Strong Class Performance',
          description: 'Your class average has improved by 8% this month',
          metric: 'Class Average',
          value: '82%',
          trend: 'up',
          action: 'View detailed analytics'
        },
        {
          id: '2',
          type: 'warning',
          title: 'Low Attendance Alert',
          description: '3 students have attendance below 80%',
          metric: 'At-Risk Students',
          value: '3',
          trend: 'down',
          action: 'View attendance details'
        },
        {
          id: '3',
          type: 'alert',
          title: 'Assignment Submission Lag',
          description: '5 students have not submitted the latest assignment',
          metric: 'Pending Submissions',
          value: '5',
          trend: 'down',
          action: 'Send reminders'
        },
        {
          id: '4',
          type: 'recommendation',
          title: 'Personalized Learning Paths',
          description: 'Consider creating targeted interventions for struggling students',
          metric: 'Recommendation',
          value: 'High Priority',
          action: 'Create intervention plan'
        },
        {
          id: '5',
          type: 'success',
          title: 'Quiz Performance Improvement',
          description: 'Average quiz scores have increased by 12% over last 2 weeks',
          metric: 'Quiz Average',
          value: '78%',
          trend: 'up',
          action: 'View quiz analytics'
        },
        {
          id: '6',
          type: 'warning',
          title: 'Grade Distribution Skew',
          description: 'Most students are clustering at the lower end of the grade range',
          metric: 'Grade Distribution',
          value: 'Skewed',
          action: 'Review assessment difficulty'
        }
      ];
      setInsights(mockInsights);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'alert':
        return 'bg-red-500/20 border-red-500/30';
      case 'recommendation':
        return 'bg-blue-500/20 border-blue-500/30';
      default:
        return 'bg-secondary-foreground/10 border-primary/20';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5 text-blue-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 text-green-400';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'alert':
        return 'bg-red-500/20 text-red-400';
      case 'recommendation':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-primary/20 text-primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-white mb-2">Performance Insights</h2>
        <p className="text-gray-400">AI-powered insights and recommendations for your class</p>
      </div>

      {/* Insights Grid */}
      {isLoading ? (
        <div className="text-center text-gray-400 py-12">Loading insights...</div>
      ) : insights.length === 0 ? (
        <div className="text-center text-gray-400 py-12">No insights available</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`border rounded-lg p-5 space-y-3 transition-all hover:shadow-lg ${getInsightColor(insight.type)}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{insight.title}</h3>
                    <p className="text-gray-300 text-sm mt-1">{insight.description}</p>
                  </div>
                </div>
                <Badge className={`${getBadgeColor(insight.type)} border-0 capitalize text-xs whitespace-nowrap`}>
                  {insight.type}
                </Badge>
              </div>

              {/* Metric */}
              <div className="bg-primary-foreground rounded-lg p-3 flex items-center justify-between">
                <span className="text-gray-400 text-sm">{insight.metric}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-lg">{insight.value}</span>
                  {insight.trend && (
                    <>
                      {insight.trend === 'up' && (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      )}
                      {insight.trend === 'down' && (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Action */}
              {insight.action && (
                <button className="w-full px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-medium transition-colors">
                  {insight.action}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Total Insights</div>
          <div className="text-2xl font-bold text-primary mt-1">{insights.length}</div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Successes</div>
          <div className="text-2xl font-bold text-green-400 mt-1">
            {insights.filter(i => i.type === 'success').length}
          </div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Warnings</div>
          <div className="text-2xl font-bold text-yellow-400 mt-1">
            {insights.filter(i => i.type === 'warning').length}
          </div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Alerts</div>
          <div className="text-2xl font-bold text-red-400 mt-1">
            {insights.filter(i => i.type === 'alert').length}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 space-y-3">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-white font-semibold mb-2">Top Recommendations</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Focus on struggling students with personalized interventions</li>
              <li>• Review assessment difficulty to improve grade distribution</li>
              <li>• Implement attendance incentive program for at-risk students</li>
              <li>• Consider peer tutoring for students below class average</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
