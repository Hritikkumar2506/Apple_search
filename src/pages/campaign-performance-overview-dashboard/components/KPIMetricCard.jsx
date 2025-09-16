import React from 'react';
import Icon from '../../../components/AppIcon';

const KPIMetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'percentage',
  trend = 'up',
  sparklineData = [],
  icon,
  format = 'currency'
}) => {
  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })?.format(val);
    }
    if (format === 'percentage') {
      return `${val}%`;
    }
    if (format === 'number') {
      return new Intl.NumberFormat('en-US')?.format(val);
    }
    return val;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const generateSparklinePath = () => {
    if (!sparklineData?.length) return '';
    
    const width = 60;
    const height = 20;
    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const range = max - min || 1;
    
    const points = sparklineData?.map((value, index) => {
      const x = (index / (sparklineData?.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });
    
    return `M ${points?.join(' L ')}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-card transition-smooth">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {icon && (
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
              <Icon name={icon} size={16} className="text-primary" />
            </div>
          )}
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        
        {sparklineData?.length > 0 && (
          <div className="w-16 h-6">
            <svg width="60" height="20" className="overflow-visible">
              <path
                d={generateSparklinePath()}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={getTrendColor()}
              />
            </svg>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-semibold text-foreground">
          {formatValue(value)}
        </div>
        
        {change !== undefined && (
          <div className="flex items-center space-x-1">
            <Icon 
              name={getTrendIcon()} 
              size={14} 
              className={getTrendColor()}
            />
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {changeType === 'percentage' ? `${Math.abs(change)}%` : formatValue(Math.abs(change))}
            </span>
            <span className="text-sm text-muted-foreground">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPIMetricCard;