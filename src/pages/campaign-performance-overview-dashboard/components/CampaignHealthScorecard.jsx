import React from 'react';
import Icon from '../../../components/AppIcon';

const CampaignHealthScorecard = ({ campaigns = [] }) => {
  const mockCampaigns = [
    {
      id: 1,
      name: "iOS App Install Campaign",
      health: "excellent",
      score: 92,
      spend: 15420,
      revenue: 38550,
      roas: 2.5,
      issues: []
    },
    {
      id: 2,
      name: "Brand Keywords Campaign",
      health: "good",
      score: 78,
      spend: 8930,
      revenue: 19650,
      roas: 2.2,
      issues: ["High CPA in evening hours"]
    },
    {
      id: 3,
      name: "Competitor Keywords Campaign",
      health: "warning",
      score: 65,
      spend: 12340,
      revenue: 18510,
      roas: 1.5,
      issues: ["Budget utilization at 95%", "Declining CTR"]
    },
    {
      id: 4,
      name: "Generic Keywords Campaign",
      health: "critical",
      score: 42,
      spend: 9870,
      revenue: 8883,
      roas: 0.9,
      issues: ["ROAS below target", "High bounce rate", "Budget overspend"]
    },
    {
      id: 5,
      name: "Holiday Promotion Campaign",
      health: "good",
      score: 81,
      spend: 6750,
      revenue: 16200,
      roas: 2.4,
      issues: ["Limited inventory impact"]
    }
  ];

  const getHealthConfig = (health) => {
    switch (health) {
      case 'excellent':
        return {
          color: 'success',
          bgColor: 'bg-success/10',
          textColor: 'text-success',
          icon: 'CheckCircle',
          label: 'Excellent'
        };
      case 'good':
        return {
          color: 'primary',
          bgColor: 'bg-primary/10',
          textColor: 'text-primary',
          icon: 'CheckCircle2',
          label: 'Good'
        };
      case 'warning':
        return {
          color: 'warning',
          bgColor: 'bg-warning/10',
          textColor: 'text-warning',
          icon: 'AlertTriangle',
          label: 'Warning'
        };
      case 'critical':
        return {
          color: 'error',
          bgColor: 'bg-error/10',
          textColor: 'text-error',
          icon: 'XCircle',
          label: 'Critical'
        };
      default:
        return {
          color: 'muted',
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
          icon: 'Circle',
          label: 'Unknown'
        };
    }
  };

  const getOverallHealth = () => {
    const healthCounts = mockCampaigns?.reduce((acc, campaign) => {
      acc[campaign.health] = (acc?.[campaign?.health] || 0) + 1;
      return acc;
    }, {});

    if (healthCounts?.critical > 0) return 'critical';
    if (healthCounts?.warning > 0) return 'warning';
    if (healthCounts?.good > 0) return 'good';
    return 'excellent';
  };

  const overallHealthConfig = getHealthConfig(getOverallHealth());

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-lg
            ${overallHealthConfig?.bgColor}
          `}>
            <Icon 
              name={overallHealthConfig?.icon} 
              size={16} 
              className={overallHealthConfig?.textColor}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Campaign Health</h3>
            <p className="text-sm text-muted-foreground">Real-time performance monitoring</p>
          </div>
        </div>
        
        <div className={`
          px-3 py-1.5 rounded-full text-sm font-medium
          ${overallHealthConfig?.bgColor} ${overallHealthConfig?.textColor}
        `}>
          {overallHealthConfig?.label}
        </div>
      </div>
      <div className="space-y-4">
        {mockCampaigns?.map((campaign) => {
          const healthConfig = getHealthConfig(campaign?.health);
          
          return (
            <div
              key={campaign?.id}
              className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`
                    flex items-center justify-center w-6 h-6 rounded-full
                    ${healthConfig?.bgColor}
                  `}>
                    <Icon 
                      name={healthConfig?.icon} 
                      size={12} 
                      className={healthConfig?.textColor}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">
                      {campaign?.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">Score:</span>
                      <span className={`text-xs font-medium ${healthConfig?.textColor}`}>
                        {campaign?.score}/100
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {campaign?.roas?.toFixed(1)}x ROAS
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${new Intl.NumberFormat('en-US')?.format(campaign?.spend)} spent
                  </div>
                </div>
              </div>
              {/* Health Score Bar */}
              <div className="mb-3">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-smooth ${
                      campaign?.score >= 80 ? 'bg-success' :
                      campaign?.score >= 60 ? 'bg-primary' :
                      campaign?.score >= 40 ? 'bg-warning' : 'bg-error'
                    }`}
                    style={{ width: `${campaign?.score}%` }}
                  />
                </div>
              </div>
              {/* Issues */}
              {campaign?.issues?.length > 0 && (
                <div className="space-y-1">
                  {campaign?.issues?.map((issue, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon name="AlertCircle" size={12} className="text-warning" />
                      <span className="text-xs text-muted-foreground">{issue}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-muted-foreground">Excellent: 1</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Good: 2</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-muted-foreground">Warning: 1</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded-full"></div>
              <span className="text-muted-foreground">Critical: 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignHealthScorecard;