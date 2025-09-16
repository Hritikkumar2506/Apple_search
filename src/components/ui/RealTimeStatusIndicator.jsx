import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const RealTimeStatusIndicator = ({ 
  connectionStatus = 'connected',
  lastUpdate = null,
  dataFreshness = 'live'
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          color: 'success',
          bgColor: 'bg-success/10',
          textColor: 'text-success',
          icon: 'Wifi',
          label: 'Live',
          pulse: true
        };
      case 'connecting':
        return {
          color: 'warning',
          bgColor: 'bg-warning/10',
          textColor: 'text-warning',
          icon: 'Loader2',
          label: 'Connecting',
          pulse: false,
          spin: true
        };
      case 'disconnected':
        return {
          color: 'error',
          bgColor: 'bg-error/10',
          textColor: 'text-error',
          icon: 'WifiOff',
          label: 'Offline',
          pulse: false
        };
      default:
        return {
          color: 'muted',
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
          icon: 'Circle',
          label: 'Unknown',
          pulse: false
        };
    }
  };

  const getLastUpdateText = () => {
    if (!lastUpdate) return currentTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const updateTime = new Date(lastUpdate);
    const diffMs = currentTime - updateTime;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffSeconds < 60) {
      return `${diffSeconds}s ago`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else {
      return updateTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const statusConfig = getStatusConfig();

  if (!isVisible) return null;

  return (
    <div className="flex items-center space-x-2">
      {/* Main Status Indicator */}
      <div className={`
        flex items-center space-x-2 px-3 py-1.5 rounded-full transition-smooth
        ${statusConfig?.bgColor}
      `}>
        {/* Status Icon */}
        <div className="relative flex items-center">
          <Icon 
            name={statusConfig?.icon} 
            size={12} 
            className={`
              ${statusConfig?.textColor}
              ${statusConfig?.spin ? 'animate-spin' : ''}
            `}
          />
          {statusConfig?.pulse && (
            <div className={`
              absolute inset-0 w-3 h-3 rounded-full animate-pulse
              bg-${statusConfig?.color}
            `} />
          )}
        </div>

        {/* Status Label */}
        <span className={`text-xs font-medium ${statusConfig?.textColor}`}>
          {statusConfig?.label}
        </span>

        {/* Separator */}
        <div className="w-px h-3 bg-border" />

        {/* Last Update Time */}
        <span className="text-xs text-muted-foreground">
          {getLastUpdateText()}
        </span>
      </div>
      {/* Data Freshness Indicator */}
      {dataFreshness === 'stale' && (
        <div className="flex items-center space-x-1 px-2 py-1 bg-warning/10 rounded-md">
          <Icon name="Clock" size={10} className="text-warning" />
          <span className="text-xs text-warning">Stale</span>
        </div>
      )}
      {/* Minimize Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="p-1 hover:bg-muted rounded-md transition-smooth"
        title="Hide status indicator"
      >
        <Icon name="X" size={12} className="text-muted-foreground" />
      </button>
    </div>
  );
};

export default RealTimeStatusIndicator;