import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RealTimeCharts = ({ data = [] }) => {
  const [selectedMetric, setSelectedMetric] = useState('spend');
  const [timeRange, setTimeRange] = useState('1h');
  const [isLive, setIsLive] = useState(true);

  // Generate mock real-time data
  const generateMockData = () => {
    const now = new Date();
    const dataPoints = [];
    
    for (let i = 59; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60000); // Every minute
      dataPoints?.push({
        time: timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: timestamp?.getTime(),
        spend: Math.random() * 100 + 200 + Math.sin(i / 10) * 50,
        impressions: Math.random() * 1000 + 5000 + Math.sin(i / 8) * 1000,
        conversions: Math.random() * 10 + 20 + Math.sin(i / 12) * 5,
        cpa: Math.random() * 5 + 15 + Math.sin(i / 15) * 3
      });
    }
    
    return dataPoints;
  };

  const [chartData, setChartData] = useState(generateMockData());

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setChartData(prevData => {
        const newData = [...prevData];
        const now = new Date();
        
        // Remove oldest point and add new one
        newData?.shift();
        newData?.push({
          time: now?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: now?.getTime(),
          spend: Math.random() * 100 + 200 + Math.sin(Date.now() / 60000) * 50,
          impressions: Math.random() * 1000 + 5000 + Math.sin(Date.now() / 48000) * 1000,
          conversions: Math.random() * 10 + 20 + Math.sin(Date.now() / 72000) * 5,
          cpa: Math.random() * 5 + 15 + Math.sin(Date.now() / 90000) * 3
        });
        
        return newData;
      });
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const metrics = [
    { 
      key: 'spend', 
      label: 'Spend Velocity', 
      color: '#3B82F6', 
      format: (value) => `$${value?.toFixed(2)}`,
      anomalyThreshold: 300
    },
    { 
      key: 'impressions', 
      label: 'Impression Trends', 
      color: '#059669', 
      format: (value) => value?.toLocaleString(),
      anomalyThreshold: 7000
    },
    { 
      key: 'conversions', 
      label: 'Conversion Patterns', 
      color: '#DC2626', 
      format: (value) => value?.toFixed(0),
      anomalyThreshold: 30
    },
    { 
      key: 'cpa', 
      label: 'CPA Fluctuations', 
      color: '#F59E0B', 
      format: (value) => `$${value?.toFixed(2)}`,
      anomalyThreshold: 20
    }
  ];

  const currentMetric = metrics?.find(m => m?.key === selectedMetric);

  // Detect anomalies
  const detectAnomalies = (data, threshold) => {
    return data?.map((point, index) => ({
      ...point,
      isAnomaly: point?.[selectedMetric] > threshold
    }));
  };

  const processedData = detectAnomalies(chartData, currentMetric?.anomalyThreshold || 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="text-sm font-medium text-popover-foreground mb-1">
            {label}
          </p>
          <p className="text-sm text-muted-foreground">
            {currentMetric?.label}: {currentMetric?.format(payload?.[0]?.value)}
          </p>
          {data?.isAnomaly && (
            <p className="text-xs text-error mt-1 flex items-center space-x-1">
              <Icon name="AlertTriangle" size={12} />
              <span>Anomaly detected</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">
            Real-Time Performance Charts
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`}></div>
            <span className="text-sm text-muted-foreground">
              {isLive ? 'Live' : 'Paused'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Metric Selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {metrics?.map((metric) => (
              <button
                key={metric?.key}
                onClick={() => setSelectedMetric(metric?.key)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md transition-smooth
                  ${selectedMetric === metric?.key
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {metric?.label}
              </button>
            ))}
          </div>

          {/* Live Toggle */}
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            iconName={isLive ? "Pause" : "Play"}
            iconPosition="left"
          >
            {isLive ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>
      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={currentMetric?.format}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Anomaly threshold line */}
            <ReferenceLine 
              y={currentMetric?.anomalyThreshold} 
              stroke="var(--color-error)" 
              strokeDasharray="5 5"
              label={{ value: "Anomaly Threshold", position: "topRight" }}
            />
            
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentMetric?.color}
              strokeWidth={2}
              dot={(props) => {
                const { payload } = props;
                if (payload?.isAnomaly) {
                  return (
                    <circle
                      cx={props?.cx}
                      cy={props?.cy}
                      r={4}
                      fill="var(--color-error)"
                      stroke="var(--color-error)"
                      strokeWidth={2}
                    />
                  );
                }
                return null;
              }}
              activeDot={{ r: 4, fill: currentMetric?.color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-primary"></div>
            <span>15-minute granularity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-error rounded-full"></div>
            <span>Anomaly detection</span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Last update: {new Date()?.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default RealTimeCharts;