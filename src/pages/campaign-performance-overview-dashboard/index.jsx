import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import GlobalFilterBar from '../../components/ui/GlobalFilterBar';
import RealTimeStatusIndicator from '../../components/ui/RealTimeStatusIndicator';
import AlertNotificationBadge from '../../components/ui/AlertNotificationBadge';
import ExportActionBar from '../../components/ui/ExportActionBar';
import KPIMetricCard from './components/KPIMetricCard';
import SpendRevenueChart from './components/SpendRevenueChart';
import CampaignHealthScorecard from './components/CampaignHealthScorecard';
import TopPerformersWidget from './components/TopPerformersWidget';
import CampaignDataTable from './components/CampaignDataTable';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CampaignPerformanceOverviewDashboard = () => {
  const [filters, setFilters] = useState({
    dateRange: 'last-7-days',
    campaigns: [],
    adGroups: [],
    keywords: ''
  });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [alerts, setAlerts] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  // Mock alerts data
  const mockAlerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Budget Overspend Alert',
      message: 'Generic Keywords Campaign has exceeded budget by 15% in the last 24 hours',
      timestamp: new Date(Date.now() - 300000),
      campaign: 'Generic Keywords',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'ROAS Below Target',
      message: 'Competitor Keywords Campaign ROAS dropped to 1.2x, below target of 2.0x',
      timestamp: new Date(Date.now() - 900000),
      campaign: 'Competitor Keywords',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Campaign Performance Update',
      message: 'iOS App Install Campaign achieved highest daily ROAS of 2.8x',
      timestamp: new Date(Date.now() - 1800000),
      campaign: 'iOS App Install',
      read: true
    }
  ];

  // KPI data
  const kpiData = [
    {
      title: 'Total Spend',
      value: 52310,
      change: 8.5,
      trend: 'up',
      icon: 'DollarSign',
      format: 'currency',
      sparklineData: [45000, 47000, 49000, 51000, 52310]
    },
    {
      title: 'Total Revenue',
      value: 110873,
      change: 12.3,
      trend: 'up',
      icon: 'TrendingUp',
      format: 'currency',
      sparklineData: [95000, 98000, 102000, 107000, 110873]
    },
    {
      title: 'Overall ROAS',
      value: 2.12,
      change: 3.8,
      trend: 'up',
      icon: 'Target',
      format: 'number',
      sparklineData: [1.95, 2.01, 2.05, 2.08, 2.12]
    },
    {
      title: 'Active Campaigns',
      value: 16,
      change: 2,
      trend: 'up',
      icon: 'Play',
      format: 'number',
      sparklineData: [14, 14, 15, 15, 16]
    }
  ];

  useEffect(() => {
    setAlerts(mockAlerts);
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastRefresh(new Date());
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleChartDrillDown = (data) => {
    console.log('Drilling down into:', data);
    // Navigate to detailed view or update filters
  };

  const handleExport = async (config) => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Exporting with config:', config);
    } finally {
      setIsExporting(false);
    }
  };

  const handleAlertClick = (alert) => {
    console.log('Alert clicked:', alert);
  };

  const handleMarkAsRead = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const handleMarkAllAsRead = () => {
    setAlerts(prev => prev?.map(alert => ({ ...alert, read: true })));
  };

  const unreadAlertCount = alerts?.filter(alert => !alert?.read)?.length;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Campaign Performance Overview - Apple Search Ads Analytics</title>
        <meta name="description" content="Comprehensive Apple Search Ads campaign performance monitoring dashboard with real-time metrics, ROI tracking, and advertising intelligence." />
      </Helmet>
      <Header />
      <GlobalFilterBar onFilterChange={handleFilterChange} initialFilters={filters} />
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Dashboard Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Campaign Performance Overview
              </h1>
              <p className="text-muted-foreground">
                Comprehensive monitoring hub for Apple Search Ads campaign performance and ROI tracking
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <RealTimeStatusIndicator 
                connectionStatus="connected"
                lastUpdate={lastRefresh}
                dataFreshness="live"
              />
              
              <AlertNotificationBadge
                alertCount={unreadAlertCount}
                alerts={alerts}
                onAlertClick={handleAlertClick}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
              />
              
              <ExportActionBar
                currentContext="overview"
                onExport={handleExport}
                isExporting={isExporting}
              />
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  iconName={autoRefresh ? "Pause" : "Play"}
                  iconPosition="left"
                >
                  {autoRefresh ? 'Pause' : 'Resume'} Auto-refresh
                </Button>
              </div>
            </div>
          </div>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {kpiData?.map((kpi, index) => (
              <KPIMetricCard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                change={kpi?.change}
                trend={kpi?.trend}
                icon={kpi?.icon}
                format={kpi?.format}
                sparklineData={kpi?.sparklineData}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
            {/* Main Chart Area */}
            <div className="xl:col-span-8">
              <SpendRevenueChart onDrillDown={handleChartDrillDown} />
            </div>
            
            {/* Right Sidebar */}
            <div className="xl:col-span-4 space-y-6">
              <CampaignHealthScorecard />
              <TopPerformersWidget />
            </div>
          </div>

          {/* Campaign Data Table */}
          <div className="mb-8">
            <CampaignDataTable onExport={handleExport} />
          </div>

          {/* Quick Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-card border border-border rounded-lg">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Last updated: {lastRefresh?.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Database" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Data source: Apple Search Ads API
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" iconName="Settings" iconPosition="left">
                Dashboard Settings
              </Button>
              <Button variant="outline" size="sm" iconName="Share" iconPosition="left">
                Share Dashboard
              </Button>
              <Button variant="primary" size="sm" iconName="Plus" iconPosition="left">
                Create Campaign
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampaignPerformanceOverviewDashboard;