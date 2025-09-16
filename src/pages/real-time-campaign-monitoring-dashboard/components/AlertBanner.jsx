import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertBanner = ({ alerts = [], onDismiss = () => {}, onViewAll = () => {} }) => {
  const criticalAlerts = alerts?.filter(alert => alert?.severity === 'critical');
  const warningAlerts = alerts?.filter(alert => alert?.severity === 'warning');
  
  if (alerts?.length === 0) return null;

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          bgColor: 'bg-error/10',
          borderColor: 'border-error',
          textColor: 'text-error',
          icon: 'AlertTriangle'
        };
      case 'warning':
        return {
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning',
          textColor: 'text-warning',
          icon: 'AlertCircle'
        };
      default:
        return {
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary',
          textColor: 'text-primary',
          icon: 'Info'
        };
    }
  };

  const primaryAlert = criticalAlerts?.[0] || warningAlerts?.[0] || alerts?.[0];
  const config = getSeverityConfig(primaryAlert?.severity);

  return (
    <div className={`
      ${config?.bgColor} ${config?.borderColor} border-l-4 p-4 mb-6
    `}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Icon 
            name={config?.icon} 
            size={20} 
            className={`${config?.textColor} mt-0.5`}
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`font-semibold ${config?.textColor}`}>
                {primaryAlert?.title}
              </h3>
              {alerts?.length > 1 && (
                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                  +{alerts?.length - 1} more
                </span>
              )}
            </div>
            <p className="text-sm text-foreground mb-2">
              {primaryAlert?.message}
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>Campaign: {primaryAlert?.campaign}</span>
              <span>•</span>
              <span>{new Date(primaryAlert.timestamp)?.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {alerts?.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAll}
            >
              View All ({alerts?.length})
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDismiss(primaryAlert?.id)}
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;