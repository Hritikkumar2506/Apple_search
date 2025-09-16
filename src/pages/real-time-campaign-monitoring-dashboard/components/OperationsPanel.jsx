import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OperationsPanel = ({ alerts = [], onAlertAction = () => {} }) => {
  const [selectedAlert, setSelectedAlert] = useState(null);

  const alertFeed = [
    {
      id: 1,
      type: 'budget',
      severity: 'critical',
      title: 'Budget Threshold Exceeded',
      message: 'iOS App Install Campaign has exceeded 90% of daily budget',
      campaign: 'iOS App Install Campaign',
      timestamp: new Date(Date.now() - 300000),
      actions: ['pause', 'increase-budget', 'investigate']
    },
    {
      id: 2,
      type: 'performance',
      severity: 'warning',
      title: 'CPA Spike Detected',
      message: 'Cost per acquisition increased by 45% in the last hour',
      campaign: 'Brand Keywords Campaign',
      timestamp: new Date(Date.now() - 600000),
      actions: ['adjust-bids', 'pause-keywords', 'investigate']
    },
    {
      id: 3,
      type: 'system',
      severity: 'info',
      title: 'API Rate Limit Warning',
      message: 'Approaching API rate limit for Apple Search Ads',
      campaign: 'System Wide',
      timestamp: new Date(Date.now() - 900000),
      actions: ['acknowledge', 'reduce-frequency']
    },
    {
      id: 4,
      type: 'performance',
      severity: 'warning',
      title: 'Low Impression Volume',
      message: 'Impressions dropped by 30% compared to yesterday',
      campaign: 'Competitor Keywords Campaign',
      timestamp: new Date(Date.now() - 1200000),
      actions: ['increase-bids', 'expand-keywords', 'investigate']
    },
    {
      id: 5,
      type: 'budget',
      severity: 'critical',
      title: 'Campaign Paused - Budget Exhausted',
      message: 'Holiday Promotion Campaign automatically paused due to budget depletion',
      campaign: 'Holiday Promotion Campaign',
      timestamp: new Date(Date.now() - 1800000),
      actions: ['add-budget', 'resume', 'investigate']
    }
  ];

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          bgColor: 'bg-error/10',
          borderColor: 'border-l-error',
          textColor: 'text-error',
          icon: 'AlertTriangle'
        };
      case 'warning':
        return {
          bgColor: 'bg-warning/10',
          borderColor: 'border-l-warning',
          textColor: 'text-warning',
          icon: 'AlertCircle'
        };
      default:
        return {
          bgColor: 'bg-primary/10',
          borderColor: 'border-l-primary',
          textColor: 'text-primary',
          icon: 'Info'
        };
    }
  };

  const getActionConfig = (action) => {
    const configs = {
      'pause': { label: 'Pause', icon: 'Pause', variant: 'destructive' },
      'increase-budget': { label: 'Increase Budget', icon: 'Plus', variant: 'default' },
      'investigate': { label: 'Investigate', icon: 'Search', variant: 'outline' },
      'adjust-bids': { label: 'Adjust Bids', icon: 'TrendingUp', variant: 'default' },
      'pause-keywords': { label: 'Pause Keywords', icon: 'Pause', variant: 'destructive' },
      'acknowledge': { label: 'Acknowledge', icon: 'Check', variant: 'outline' },
      'reduce-frequency': { label: 'Reduce Frequency', icon: 'Minus', variant: 'outline' },
      'expand-keywords': { label: 'Expand Keywords', icon: 'Plus', variant: 'default' },
      'add-budget': { label: 'Add Budget', icon: 'DollarSign', variant: 'default' },
      'resume': { label: 'Resume', icon: 'Play', variant: 'default' }
    };
    return configs?.[action] || { label: action, icon: 'Circle', variant: 'outline' };
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

  const handleAlertAction = (alertId, action) => {
    onAlertAction(alertId, action);
    // In a real app, this would trigger the appropriate API call
    console.log(`Executing action: ${action} for alert: ${alertId}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Activity" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Operations Center
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-error text-error-foreground text-xs rounded-full">
            {alertFeed?.filter(a => a?.severity === 'critical')?.length}
          </span>
          <span className="px-2 py-1 bg-warning text-warning-foreground text-xs rounded-full">
            {alertFeed?.filter(a => a?.severity === 'warning')?.length}
          </span>
        </div>
      </div>
      {/* Emergency Controls */}
      <div className="mb-6 p-4 bg-error/5 border border-error/20 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
          <Icon name="Zap" size={16} className="text-error" />
          <span>Emergency Controls</span>
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="destructive"
            size="sm"
            iconName="Square"
            iconPosition="left"
            onClick={() => handleAlertAction('emergency', 'pause-all')}
          >
            Pause All
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Shield"
            iconPosition="left"
            onClick={() => handleAlertAction('emergency', 'budget-protection')}
          >
            Budget Lock
          </Button>
        </div>
      </div>
      {/* Alert Feed */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <h4 className="text-sm font-medium text-foreground sticky top-0 bg-card py-2">
          Active Alerts ({alertFeed?.length})
        </h4>
        
        {alertFeed?.map((alert) => {
          const config = getSeverityConfig(alert?.severity);
          const isSelected = selectedAlert === alert?.id;
          
          return (
            <div
              key={alert?.id}
              className={`
                ${config?.bgColor} border-l-4 ${config?.borderColor} p-4 rounded-r-lg
                transition-smooth cursor-pointer
                ${isSelected ? 'ring-2 ring-primary/20' : ''}
              `}
              onClick={() => setSelectedAlert(isSelected ? null : alert?.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-2">
                  <Icon 
                    name={config?.icon} 
                    size={16} 
                    className={`${config?.textColor} mt-0.5`}
                  />
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-foreground">
                      {alert?.title}
                    </h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert?.message}
                    </p>
                  </div>
                </div>
                <Icon 
                  name={isSelected ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-muted-foreground"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>{alert?.campaign}</span>
                <span>{formatTimeAgo(alert?.timestamp)}</span>
              </div>
              {/* Quick Actions */}
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex flex-wrap gap-2">
                    {alert?.actions?.map((action) => {
                      const actionConfig = getActionConfig(action);
                      return (
                        <Button
                          key={action}
                          variant={actionConfig?.variant}
                          size="xs"
                          iconName={actionConfig?.icon}
                          iconPosition="left"
                          onClick={(e) => {
                            e?.stopPropagation();
                            handleAlertAction(alert?.id, action);
                          }}
                        >
                          {actionConfig?.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Panel Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Auto-refresh: 30s</span>
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OperationsPanel;