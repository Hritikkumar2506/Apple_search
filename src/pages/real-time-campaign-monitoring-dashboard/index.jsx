import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import GlobalFilterBar from '../../components/ui/GlobalFilterBar';
import AlertBanner from './components/AlertBanner';
import RealTimeMetricsStrip from './components/RealTimeMetricsStrip';
import RealTimeCharts from './components/RealTimeCharts';
import OperationsPanel from './components/OperationsPanel';
import CampaignStatusGrid from './components/CampaignStatusGrid';

const RealTimeCampaignMonitoringDashboard = () => {
  const [filters, setFilters] = useState({
    dateRange: 'last-7-days',
    campaigns: [],
    adGroups: [],
    keywords: ''
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      severity: 'critical',
      title: 'Budget Threshold Exceeded',
      message: 'iOS App Install Campaign has exceeded 90% of daily budget allocation',
      campaign: 'iOS App Install Campaign',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      severity: 'warning',
      title: 'Performance Anomaly Detected',
      message: 'CPA increased by 45% in the last hour across brand keywords',
      campaign: 'Brand Keywords Campaign',
      timestamp: new Date(Date.now() - 600000)
    }
  ]);

  const [realTimeMetrics, setRealTimeMetrics] = useState({
    currentSpendRate: 247.50,
    impressionsPerMinute: 1250,
    activeCampaigns: 6,
    systemHealth: 99.8,
    spendTrend: 'up',
    impressionsTrend: 'up'
  });

  const [connectionStatus, setConnectionStatus] = useState('connected');

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        ...prev,
        currentSpendRate: prev?.currentSpendRate + (Math.random() - 0.5) * 20,
        impressionsPerMinute: prev?.impressionsPerMinute + Math.floor((Math.random() - 0.5) * 200),
        systemHealth: Math.max(95, Math.min(100, prev?.systemHealth + (Math.random() - 0.5) * 2))
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate connection status changes
  useEffect(() => {
    const statusInterval = setInterval(() => {
      const statuses = ['connected', 'connecting', 'disconnected'];
      const weights = [0.85, 0.10, 0.05]; // 85% connected, 10% connecting, 5% disconnected
      
      const random = Math.random();
      let cumulativeWeight = 0;
      
      for (let i = 0; i < statuses?.length; i++) {
        cumulativeWeight += weights?.[i];
        if (random <= cumulativeWeight) {
          setConnectionStatus(statuses?.[i]);
          break;
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(statusInterval);
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // In a real app, this would trigger data refetch
    console.log('Filters updated:', newFilters);
  };

  const handleAlertDismiss = (alertId) => {
    setAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
  };

  const handleViewAllAlerts = () => {
    // Navigate to alerts page or open modal
    console.log('View all alerts');
  };

  const handleAlertAction = (alertId, action) => {
    console.log(`Alert action: ${action} for alert: ${alertId}`);
    // In a real app, this would trigger the appropriate API call
  };

  const handleCampaignAction = (campaignId, action) => {
    console.log(`Campaign action: ${action} for campaign: ${campaignId}`);
    // In a real app, this would trigger the appropriate API call
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Real-Time Campaign Monitoring Dashboard - Apple Search Ads Analytics</title>
        <meta name="description" content="Operational command center providing live campaign monitoring and alert management for performance marketers requiring immediate optimization responses." />
      </Helmet>

      {/* Header */}
      <Header />

      {/* Global Filter Bar */}
      <GlobalFilterBar 
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {/* Main Content */}
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Alert Banner */}
          <AlertBanner
            alerts={alerts}
            onDismiss={handleAlertDismiss}
            onViewAll={handleViewAllAlerts}
          />

          {/* Real-Time Metrics Strip */}
          <RealTimeMetricsStrip metrics={realTimeMetrics} />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Central Monitoring Area - 2/3 width on xl screens */}
            <div className="xl:col-span-2">
              <RealTimeCharts />
            </div>

            {/* Right Operations Panel - 1/3 width on xl screens */}
            <div className="xl:col-span-1">
              <OperationsPanel
                alerts={alerts}
                onAlertAction={handleAlertAction}
              />
            </div>
          </div>

          {/* Campaign Status Grid */}
          <CampaignStatusGrid
            onCampaignAction={handleCampaignAction}
          />
        </div>
      </main>

      {/* Connection Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`
          flex items-center space-x-2 px-3 py-2 rounded-full shadow-modal
          ${connectionStatus === 'connected' ? 'bg-success/10 text-success' :
            connectionStatus === 'connecting'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'}
        `}>
          <div className={`
            w-2 h-2 rounded-full
            ${connectionStatus === 'connected' ? 'bg-success animate-pulse' :
              connectionStatus === 'connecting'? 'bg-warning animate-spin' : 'bg-error'}
          `}></div>
          <span className="text-xs font-medium">
            {connectionStatus === 'connected' ? 'Live' :
             connectionStatus === 'connecting'? 'Connecting' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RealTimeCampaignMonitoringDashboard;