import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const RealTimeMetricsStrip = ({ metrics = {} }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const metricCards = [
    {
      id: 'spend-rate',
      label: 'Current Spend Rate',
      value: `$${metrics?.currentSpendRate || '0.00'}`,
      unit: '/hour',
      trend: metrics?.spendTrend || 'up',
      trendValue: '+12%',
      icon: 'DollarSign',
      color: 'primary'
    },
    {
      id: 'impressions',
      label: 'Impressions',
      value: (metrics?.impressionsPerMinute || 0)?.toLocaleString(),
      unit: '/min',
      trend: metrics?.impressionsTrend || 'up',
      trendValue: '+8%',
      icon: 'Eye',
      color: 'accent'
    },
    {
      id: 'active-campaigns',
      label: 'Active Campaigns',
      value: metrics?.activeCampaigns || '0',
      unit: 'running',
      trend: 'stable',
      trendValue: '0%',
      icon: 'Play',
      color: 'success'
    },
    {
      id: 'system-health',
      label: 'System Health',
      value: `${metrics?.systemHealth || 100}%`,
      unit: 'uptime',
      trend: 'stable',
      trendValue: '99.9%',
      icon: 'Activity',
      color: 'success'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return 'TrendingUp';
      case 'down':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <h2 className="text-lg font-semibold text-foreground">Live Metrics</h2>
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {currentTime?.toLocaleTimeString()}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards?.map((metric) => (
          <div
            key={metric?.id}
            className="bg-muted/30 rounded-lg p-4 border border-border"
          >
            <div className="flex items-center justify-between mb-2">
              <Icon 
                name={metric?.icon} 
                size={20} 
                className={`text-${metric?.color}`}
              />
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getTrendIcon(metric?.trend)} 
                  size={14} 
                  className={getTrendColor(metric?.trend)}
                />
                <span className={`text-xs ${getTrendColor(metric?.trend)}`}>
                  {metric?.trendValue}
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-foreground">
                  {metric?.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {metric?.unit}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {metric?.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealTimeMetricsStrip;