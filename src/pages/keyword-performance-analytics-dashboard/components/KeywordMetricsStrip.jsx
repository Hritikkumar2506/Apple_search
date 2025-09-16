import React from 'react';
import Icon from '../../../components/AppIcon';

const KeywordMetricsStrip = ({ metrics }) => {
  const metricCards = [
    {
      id: 'total-keywords',
      label: 'Total Keywords',
      value: metrics?.totalKeywords,
      change: metrics?.totalKeywordsChange,
      icon: 'Search',
      color: 'primary',
      histogram: metrics?.keywordDistribution
    },
    {
      id: 'avg-cpa',
      label: 'Avg CPA',
      value: `$${metrics?.avgCPA}`,
      change: metrics?.avgCPAChange,
      icon: 'DollarSign',
      color: 'success',
      histogram: metrics?.cpaDistribution
    },
    {
      id: 'impression-share',
      label: 'Impression Share',
      value: `${metrics?.impressionShare}%`,
      change: metrics?.impressionShareChange,
      icon: 'Eye',
      color: 'accent',
      histogram: metrics?.impressionDistribution
    },
    {
      id: 'conversion-rate',
      label: 'Conversion Rate',
      value: `${metrics?.conversionRate}%`,
      change: metrics?.conversionRateChange,
      icon: 'Target',
      color: 'warning',
      histogram: metrics?.conversionDistribution
    }
  ];

  const getChangeColor = (change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return 'TrendingUp';
    if (change < 0) return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metricCards?.map((metric) => (
        <div key={metric?.id} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-lg
              ${metric?.color === 'primary' ? 'bg-primary/10' :
                metric?.color === 'success' ? 'bg-success/10' :
                metric?.color === 'accent'? 'bg-accent/10' : 'bg-warning/10'}
            `}>
              <Icon 
                name={metric?.icon} 
                size={20} 
                className={`
                  ${metric?.color === 'primary' ? 'text-primary' :
                    metric?.color === 'success' ? 'text-success' :
                    metric?.color === 'accent'? 'text-accent' : 'text-warning'}
                `}
              />
            </div>
            <div className={`flex items-center space-x-1 ${getChangeColor(metric?.change)}`}>
              <Icon name={getChangeIcon(metric?.change)} size={14} />
              <span className="text-sm font-medium">
                {Math.abs(metric?.change)}%
              </span>
            </div>
          </div>

          <div className="mb-3">
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {metric?.value}
            </h3>
            <p className="text-sm text-muted-foreground">
              {metric?.label}
            </p>
          </div>

          {/* Mini Histogram */}
          <div className="flex items-end space-x-1 h-8">
            {metric?.histogram?.map((value, index) => (
              <div
                key={index}
                className={`
                  flex-1 rounded-sm
                  ${metric?.color === 'primary' ? 'bg-primary/20' :
                    metric?.color === 'success' ? 'bg-success/20' :
                    metric?.color === 'accent'? 'bg-accent/20' : 'bg-warning/20'}
                `}
                style={{ height: `${(value / Math.max(...metric?.histogram)) * 100}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KeywordMetricsStrip;