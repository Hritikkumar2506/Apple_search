import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const AlertNotificationBadge = ({ 
  alertCount = 0,
  alerts = [],
  onAlertClick = () => {},
  onMarkAsRead = () => {},
  onMarkAllAsRead = () => {}
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getAlertTypeConfig = (type) => {
    switch (type) {
      case 'critical':
        return {
          color: 'error',
          bgColor: 'bg-error/10',
          textColor: 'text-error',
          icon: 'AlertTriangle'
        };
      case 'warning':
        return {
          color: 'warning',
          bgColor: 'bg-warning/10',
          textColor: 'text-warning',
          icon: 'AlertCircle'
        };
      case 'info':
        return {
          color: 'primary',
          bgColor: 'bg-primary/10',
          textColor: 'text-primary',
          icon: 'Info'
        };
      default:
        return {
          color: 'muted',
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
          icon: 'Bell'
        };
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now - alertTime;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return alertTime?.toLocaleDateString();
  };

  const handleBadgeClick = () => {
    if (alertCount > 0) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleAlertItemClick = (alert) => {
    onAlertClick(alert);
    if (!alert?.read) {
      onMarkAsRead(alert?.id);
    }
  };

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead();
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      {/* Alert Badge Button */}
      <button
        onClick={handleBadgeClick}
        className={`
          relative p-2 rounded-md transition-smooth
          ${alertCount > 0 
            ? 'hover:bg-muted text-foreground' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }
        `}
        title={`${alertCount} active alerts`}
      >
        <Icon name="Bell" size={18} />
        
        {/* Badge Count */}
        {alertCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center px-1">
            {alertCount > 99 ? '99+' : alertCount}
          </span>
        )}
      </button>
      {/* Dropdown Menu */}
      {isDropdownOpen && alertCount > 0 && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[1099]"
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-md shadow-modal z-[1100] max-h-96 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <Icon name="Bell" size={16} />
                <h3 className="font-medium text-popover-foreground">
                  Alerts ({alertCount})
                </h3>
              </div>
              
              {alerts?.some(alert => !alert?.read) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>

            {/* Alert List */}
            <div className="max-h-64 overflow-y-auto">
              {alerts?.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Icon name="CheckCircle" size={24} className="mx-auto mb-2" />
                  <p className="text-sm">No active alerts</p>
                </div>
              ) : (
                alerts?.map((alert) => {
                  const config = getAlertTypeConfig(alert?.type);
                  
                  return (
                    <button
                      key={alert?.id}
                      onClick={() => handleAlertItemClick(alert)}
                      className={`
                        w-full p-4 text-left border-b border-border last:border-b-0 
                        hover:bg-muted transition-smooth
                        ${!alert?.read ? 'bg-primary/5' : ''}
                      `}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Alert Icon */}
                        <div className={`
                          flex items-center justify-center w-8 h-8 rounded-full mt-0.5
                          ${config?.bgColor}
                        `}>
                          <Icon 
                            name={config?.icon} 
                            size={14} 
                            className={config?.textColor}
                          />
                        </div>

                        {/* Alert Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`
                              text-sm font-medium truncate
                              ${!alert?.read ? 'text-popover-foreground' : 'text-muted-foreground'}
                            `}>
                              {alert?.title}
                            </h4>
                            {!alert?.read && (
                              <div className="w-2 h-2 bg-primary rounded-full ml-2 flex-shrink-0" />
                            )}
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {alert?.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(alert?.timestamp)}
                            </span>
                            
                            {alert?.campaign && (
                              <span className="text-xs bg-muted px-2 py-1 rounded-md">
                                {alert?.campaign}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {alerts?.length > 0 && (
              <div className="p-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    setIsDropdownOpen(false);
                    window.location.href = '/alerts';
                  }}
                >
                  View all alerts
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AlertNotificationBadge;