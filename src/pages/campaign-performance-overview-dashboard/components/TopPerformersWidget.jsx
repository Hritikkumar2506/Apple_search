import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TopPerformersWidget = () => {
  const [activeTab, setActiveTab] = useState('top');

  const topPerformers = [
    {
      id: 1,
      name: "iOS App Install Campaign",
      metric: "ROAS",
      value: 2.8,
      change: 12.5,
      trend: "up",
      spend: 15420,
      revenue: 43176
    },
    {
      id: 2,
      name: "Holiday Promotion Campaign",
      metric: "ROAS",
      value: 2.4,
      change: 8.3,
      trend: "up",
      spend: 6750,
      revenue: 16200
    },
    {
      id: 3,
      name: "Brand Keywords Campaign",
      metric: "ROAS",
      value: 2.2,
      change: 5.7,
      trend: "up",
      spend: 8930,
      revenue: 19650
    },
    {
      id: 4,
      name: "Long Tail Keywords",
      metric: "CTR",
      value: 4.2,
      change: 15.2,
      trend: "up",
      spend: 3240,
      revenue: 8100
    },
    {
      id: 5,
      name: "Category Terms Campaign",
      metric: "CVR",
      value: 3.8,
      change: 9.1,
      trend: "up",
      spend: 5670,
      revenue: 12450
    }
  ];

  const bottomPerformers = [
    {
      id: 1,
      name: "Generic Keywords Campaign",
      metric: "ROAS",
      value: 0.9,
      change: -18.5,
      trend: "down",
      spend: 9870,
      revenue: 8883
    },
    {
      id: 2,
      name: "Competitor Terms Campaign",
      metric: "ROAS",
      value: 1.2,
      change: -12.3,
      trend: "down",
      spend: 7650,
      revenue: 9180
    },
    {
      id: 3,
      name: "Broad Match Keywords",
      metric: "CTR",
      value: 1.8,
      change: -8.7,
      trend: "down",
      spend: 4320,
      revenue: 6048
    },
    {
      id: 4,
      name: "Evening Hours Campaign",
      metric: "CPA",
      value: 45.2,
      change: 22.1,
      trend: "down",
      spend: 3890,
      revenue: 4280
    },
    {
      id: 5,
      name: "Weekend Targeting",
      metric: "CVR",
      value: 1.4,
      change: -15.6,
      trend: "down",
      spend: 2150,
      revenue: 2580
    }
  ];

  const formatMetricValue = (value, metric) => {
    switch (metric) {
      case 'ROAS':
        return `${value?.toFixed(1)}x`;
      case 'CTR': case'CVR':
        return `${value?.toFixed(1)}%`;
      case 'CPA':
        return `$${value?.toFixed(2)}`;
      default:
        return value?.toString();
    }
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-success' : 'text-error';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  const currentData = activeTab === 'top' ? topPerformers : bottomPerformers;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-accent/10 rounded-lg">
            <Icon name="Trophy" size={16} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Performance Rankings</h3>
            <p className="text-sm text-muted-foreground">Top & bottom performers</p>
          </div>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('top')}
          className={`
            flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth
            ${activeTab === 'top' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="TrendingUp" size={14} />
            <span>Top Performers</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('bottom')}
          className={`
            flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth
            ${activeTab === 'bottom' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="TrendingDown" size={14} />
            <span>Needs Attention</span>
          </div>
        </button>
      </div>
      {/* Performers List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {currentData?.map((item, index) => (
          <div
            key={item?.id}
            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
          >
            <div className="flex items-center space-x-3">
              <div className={`
                flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                ${activeTab === 'top' 
                  ? index === 0 ? 'bg-warning text-warning-foreground' :
                    index === 1 ? 'bg-muted text-muted-foreground' :
                    index === 2 ? 'bg-warning/30 text-warning': 'bg-muted text-muted-foreground' :'bg-error/10 text-error'
                }
              `}>
                {index + 1}
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">
                  {item?.name}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    ${new Intl.NumberFormat('en-US')?.format(item?.spend)} spent
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    ${new Intl.NumberFormat('en-US')?.format(item?.revenue)} revenue
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {formatMetricValue(item?.value, item?.metric)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item?.metric}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={getTrendIcon(item?.trend)} 
                    size={12} 
                    className={getTrendColor(item?.trend)}
                  />
                  <span className={`text-xs font-medium ${getTrendColor(item?.trend)}`}>
                    {Math.abs(item?.change)?.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Info" size={14} />
            <span>Based on last 7 days performance</span>
          </div>
          <button className="text-primary hover:text-primary/80 transition-smooth">
            View detailed report
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopPerformersWidget;