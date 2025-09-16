import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CampaignStatusGrid = ({ campaigns = [], onCampaignAction = () => {} }) => {
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  const mockCampaigns = [
    {
      id: 'camp-1',
      name: 'iOS App Install Campaign',
      status: 'running',
      health: 'critical',
      spend: 2847.50,
      budget: 3000,
      impressions: 45230,
      conversions: 127,
      cpa: 22.42,
      lastUpdate: new Date(Date.now() - 120000),
      issues: ['Budget threshold exceeded', 'High CPA']
    },
    {
      id: 'camp-2',
      name: 'Brand Keywords Campaign',
      status: 'running',
      health: 'warning',
      spend: 1245.80,
      budget: 2000,
      impressions: 28450,
      conversions: 89,
      cpa: 14.00,
      lastUpdate: new Date(Date.now() - 180000),
      issues: ['CPA spike detected']
    },
    {
      id: 'camp-3',
      name: 'Competitor Keywords Campaign',
      status: 'running',
      health: 'good',
      spend: 890.25,
      budget: 1500,
      impressions: 19850,
      conversions: 65,
      cpa: 13.70,
      lastUpdate: new Date(Date.now() - 90000),
      issues: []
    },
    {
      id: 'camp-4',
      name: 'Generic Keywords Campaign',
      status: 'paused',
      health: 'paused',
      spend: 567.40,
      budget: 1000,
      impressions: 12340,
      conversions: 34,
      cpa: 16.69,
      lastUpdate: new Date(Date.now() - 3600000),
      issues: ['Manually paused for optimization']
    },
    {
      id: 'camp-5',
      name: 'Holiday Promotion Campaign',
      status: 'paused',
      health: 'critical',
      spend: 1500.00,
      budget: 1500,
      impressions: 35670,
      conversions: 78,
      cpa: 19.23,
      lastUpdate: new Date(Date.now() - 1800000),
      issues: ['Budget exhausted', 'Auto-paused']
    },
    {
      id: 'camp-6',
      name: 'Retargeting Campaign',
      status: 'running',
      health: 'good',
      spend: 345.60,
      budget: 800,
      impressions: 8920,
      conversions: 42,
      cpa: 8.23,
      lastUpdate: new Date(Date.now() - 240000),
      issues: []
    }
  ];

  const getHealthConfig = (health) => {
    switch (health) {
      case 'good':
        return {
          color: 'success',
          bgColor: 'bg-success/10',
          textColor: 'text-success',
          icon: 'CheckCircle',
          label: 'Healthy'
        };
      case 'warning':
        return {
          color: 'warning',
          bgColor: 'bg-warning/10',
          textColor: 'text-warning',
          icon: 'AlertCircle',
          label: 'Warning'
        };
      case 'critical':
        return {
          color: 'error',
          bgColor: 'bg-error/10',
          textColor: 'text-error',
          icon: 'AlertTriangle',
          label: 'Critical'
        };
      case 'paused':
        return {
          color: 'muted',
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
          icon: 'Pause',
          label: 'Paused'
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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'running':
        return {
          color: 'success',
          icon: 'Play',
          label: 'Running'
        };
      case 'paused':
        return {
          color: 'muted',
          icon: 'Pause',
          label: 'Paused'
        };
      default:
        return {
          color: 'muted',
          icon: 'Circle',
          label: 'Unknown'
        };
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return timestamp?.toLocaleDateString();
  };

  const handleCampaignSelect = (campaignId) => {
    setSelectedCampaigns(prev => 
      prev?.includes(campaignId)
        ? prev?.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleBulkAction = (action) => {
    selectedCampaigns?.forEach(campaignId => {
      onCampaignAction(campaignId, action);
    });
    setSelectedCampaigns([]);
  };

  const getBudgetUtilization = (spend, budget) => {
    return Math.min((spend / budget) * 100, 100);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Grid3X3" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Campaign Status Grid
          </h3>
          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
            {mockCampaigns?.length} campaigns
          </span>
        </div>

        {/* Bulk Actions */}
        {selectedCampaigns?.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedCampaigns?.length} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              iconName="Pause"
              iconPosition="left"
              onClick={() => handleBulkAction('pause')}
            >
              Pause
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Play"
              iconPosition="left"
              onClick={() => handleBulkAction('resume')}
            >
              Resume
            </Button>
          </div>
        )}
      </div>
      {/* Campaign Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockCampaigns?.map((campaign) => {
          const healthConfig = getHealthConfig(campaign?.health);
          const statusConfig = getStatusConfig(campaign?.status);
          const budgetUtilization = getBudgetUtilization(campaign?.spend, campaign?.budget);
          const isSelected = selectedCampaigns?.includes(campaign?.id);

          return (
            <div
              key={campaign?.id}
              className={`
                border rounded-lg p-4 transition-smooth cursor-pointer
                ${isSelected 
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }
              `}
              onClick={() => handleCampaignSelect(campaign?.id)}
            >
              {/* Campaign Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">
                    {campaign?.name}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`flex items-center space-x-1 ${statusConfig?.color === 'success' ? 'text-success' : 'text-muted-foreground'}`}>
                      <Icon name={statusConfig?.icon} size={12} />
                      <span className="text-xs">{statusConfig?.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(campaign?.lastUpdate)}
                    </span>
                  </div>
                </div>

                {/* Health Indicator */}
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full
                  ${healthConfig?.bgColor}
                `}>
                  <Icon 
                    name={healthConfig?.icon} 
                    size={16} 
                    className={healthConfig?.textColor}
                  />
                </div>
              </div>
              {/* Budget Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="text-foreground">
                    ${campaign?.spend?.toLocaleString()} / ${campaign?.budget?.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`
                      h-2 rounded-full transition-smooth
                      ${budgetUtilization > 90 ? 'bg-error' : 
                        budgetUtilization > 75 ? 'bg-warning' : 'bg-success'}
                    `}
                    style={{ width: `${budgetUtilization}%` }}
                  ></div>
                </div>
              </div>
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Impressions</div>
                  <div className="text-sm font-medium text-foreground">
                    {campaign?.impressions?.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Conversions</div>
                  <div className="text-sm font-medium text-foreground">
                    {campaign?.conversions}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">CPA</div>
                  <div className="text-sm font-medium text-foreground">
                    ${campaign?.cpa?.toFixed(2)}
                  </div>
                </div>
              </div>
              {/* Issues */}
              {campaign?.issues?.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-muted-foreground mb-1">Issues:</div>
                  <div className="space-y-1">
                    {campaign?.issues?.slice(0, 2)?.map((issue, index) => (
                      <div key={index} className="text-xs text-error bg-error/10 px-2 py-1 rounded">
                        {issue}
                      </div>
                    ))}
                    {campaign?.issues?.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{campaign?.issues?.length - 2} more issues
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center space-x-1">
                  {campaign?.status === 'running' ? (
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Pause"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onCampaignAction(campaign?.id, 'pause');
                      }}
                    >
                      Pause
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Play"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onCampaignAction(campaign?.id, 'resume');
                      }}
                    >
                      Resume
                    </Button>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="Settings"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onCampaignAction(campaign?.id, 'settings');
                  }}
                >
                  Settings
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Grid Footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span>Healthy ({mockCampaigns?.filter(c => c?.health === 'good')?.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span>Warning ({mockCampaigns?.filter(c => c?.health === 'warning')?.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span>Critical ({mockCampaigns?.filter(c => c?.health === 'critical')?.length})</span>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          iconName="RefreshCw"
          iconPosition="left"
        >
          Refresh All
        </Button>
      </div>
    </div>
  );
};

export default CampaignStatusGrid;