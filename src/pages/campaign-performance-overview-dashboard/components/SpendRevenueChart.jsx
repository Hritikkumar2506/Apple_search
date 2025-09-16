import React, { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const SpendRevenueChart = ({ data = [], onDrillDown = () => {} }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  
  const mockData = [
    { date: '09/08', spend: 2400, revenue: 4800, campaigns: 12 },
    { date: '09/09', spend: 1398, revenue: 3200, campaigns: 11 },
    { date: '09/10', spend: 9800, revenue: 15600, campaigns: 13 },
    { date: '09/11', spend: 3908, revenue: 7200, campaigns: 14 },
    { date: '09/12', spend: 4800, revenue: 9600, campaigns: 12 },
    { date: '09/13', spend: 3800, revenue: 8400, campaigns: 15 },
    { date: '09/14', spend: 4300, revenue: 9800, campaigns: 13 },
    { date: '09/15', spend: 5200, revenue: 11200, campaigns: 16 }
  ];

  const periodOptions = [
    { value: '7d', label: '7 Days' },
    { value: '14d', label: '14 Days' },
    { value: '30d', label: '30 Days' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-sm"></div>
                <span className="text-sm text-muted-foreground">Spend:</span>
              </div>
              <span className="text-sm font-medium">
                ${new Intl.NumberFormat('en-US')?.format(data?.spend)}
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-sm"></div>
                <span className="text-sm text-muted-foreground">Revenue:</span>
              </div>
              <span className="text-sm font-medium">
                ${new Intl.NumberFormat('en-US')?.format(data?.revenue)}
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm text-muted-foreground">ROAS:</span>
              <span className="text-sm font-medium">
                {(data?.revenue / data?.spend)?.toFixed(2)}x
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm text-muted-foreground">Campaigns:</span>
              <span className="text-sm font-medium">{data?.campaigns}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data) => {
    onDrillDown({
      date: data?.date,
      spend: data?.spend,
      revenue: data?.revenue,
      campaigns: data?.campaigns
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
            <Icon name="BarChart3" size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Spend vs Revenue</h3>
            <p className="text-sm text-muted-foreground">Daily performance comparison</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {periodOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setSelectedPeriod(option?.value)}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-md transition-smooth
                ${selectedPeriod === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              {option?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={mockData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="spend"
              fill="var(--color-primary)"
              name="Spend"
              radius={[2, 2, 0, 0]}
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-success)"
              strokeWidth={3}
              name="Revenue"
              dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-success)', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-sm"></div>
            <span>Click bars to drill down by campaign</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={14} />
          <span>Data refreshed 2 minutes ago</span>
        </div>
      </div>
    </div>
  );
};

export default SpendRevenueChart;