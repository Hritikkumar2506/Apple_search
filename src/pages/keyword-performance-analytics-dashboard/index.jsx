import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import GlobalFilterBar from '../../components/ui/GlobalFilterBar';
import RealTimeStatusIndicator from '../../components/ui/RealTimeStatusIndicator';
import AlertNotificationBadge from '../../components/ui/AlertNotificationBadge';
import ExportActionBar from '../../components/ui/ExportActionBar';
import KeywordMetricsStrip from './components/KeywordMetricsStrip';
import KeywordHeatmap from './components/KeywordHeatmap';
import KeywordRankingPanel from './components/KeywordRankingPanel';
import KeywordPerformanceTable from './components/KeywordPerformanceTable';
import KeywordFilterBar from './components/KeywordFilterBar';

const KeywordPerformanceAnalyticsDashboard = () => {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [filters, setFilters] = useState({});
  const [keywordFilters, setKeywordFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for keyword performance analytics
  const mockMetrics = {
    totalKeywords: 1247,
    totalKeywordsChange: 8.2,
    avgCPA: 24.50,
    avgCPAChange: -12.5,
    impressionShare: 67.8,
    impressionShareChange: 5.3,
    conversionRate: 3.2,
    conversionRateChange: 15.7,
    keywordDistribution: [12, 18, 25, 32, 28, 22, 15, 8],
    cpaDistribution: [8, 15, 28, 35, 25, 18, 12, 6],
    impressionDistribution: [5, 12, 22, 38, 42, 35, 28, 15],
    conversionDistribution: [3, 8, 15, 25, 32, 28, 20, 12]
  };

  const mockKeywords = [
    {
      id: 'kw-1',
      term: 'fitness app',
      matchType: 'exact',
      impressions: 125000,
      clicks: 3750,
      conversions: 187,
      conversionRate: 4.99,
      spend: 4575,
      cpa: 24.46,
      searchVolume: 89000,
      searchVolumeTrend: 12.5,
      status: 'active'
    },
    {
      id: 'kw-2',
      term: 'workout tracker',
      matchType: 'phrase',
      impressions: 98000,
      clicks: 2940,
      conversions: 132,
      conversionRate: 4.49,
      spend: 3528,
      cpa: 26.73,
      searchVolume: 67000,
      searchVolumeTrend: 8.3,
      status: 'active'
    },
    {
      id: 'kw-3',
      term: 'exercise planner',
      matchType: 'broad',
      impressions: 156000,
      clicks: 4680,
      conversions: 156,
      conversionRate: 3.33,
      spend: 5616,
      cpa: 36.00,
      searchVolume: 45000,
      searchVolumeTrend: -5.2,
      status: 'active'
    },
    {
      id: 'kw-4',
      term: 'gym companion app',
      matchType: 'exact',
      impressions: 67000,
      clicks: 2010,
      conversions: 141,
      conversionRate: 7.01,
      spend: 2412,
      cpa: 17.11,
      searchVolume: 23000,
      searchVolumeTrend: 18.7,
      status: 'active'
    },
    {
      id: 'kw-5',
      term: 'personal trainer app',
      matchType: 'phrase',
      impressions: 89000,
      clicks: 2670,
      conversions: 107,
      conversionRate: 4.01,
      spend: 3204,
      cpa: 29.94,
      searchVolume: 34000,
      searchVolumeTrend: 6.8,
      status: 'active'
    },
    {
      id: 'kw-6',
      term: 'home workout',
      matchType: 'broad',
      impressions: 234000,
      clicks: 7020,
      conversions: 175,
      conversionRate: 2.49,
      spend: 8424,
      cpa: 48.14,
      searchVolume: 156000,
      searchVolumeTrend: -3.1,
      status: 'active'
    },
    {
      id: 'kw-7',
      term: 'strength training app',
      matchType: 'exact',
      impressions: 45000,
      clicks: 1350,
      conversions: 81,
      conversionRate: 6.00,
      spend: 1620,
      cpa: 20.00,
      searchVolume: 28000,
      searchVolumeTrend: 22.4,
      status: 'active'
    },
    {
      id: 'kw-8',
      term: 'cardio tracker',
      matchType: 'phrase',
      impressions: 78000,
      clicks: 2340,
      conversions: 94,
      conversionRate: 4.02,
      spend: 2808,
      cpa: 29.87,
      searchVolume: 41000,
      searchVolumeTrend: 4.6,
      status: 'active'
    },
    {
      id: 'kw-9',
      term: 'yoga app',
      matchType: 'broad',
      impressions: 187000,
      clicks: 5610,
      conversions: 168,
      conversionRate: 2.99,
      spend: 6732,
      cpa: 40.07,
      searchVolume: 98000,
      searchVolumeTrend: 7.9,
      status: 'active'
    },
    {
      id: 'kw-10',
      term: 'running companion',
      matchType: 'exact',
      impressions: 56000,
      clicks: 1680,
      conversions: 118,
      conversionRate: 7.02,
      spend: 2016,
      cpa: 17.08,
      searchVolume: 31000,
      searchVolumeTrend: 15.3,
      status: 'active'
    }
  ];

  const mockAlerts = [
    {
      id: 'alert-1',
      type: 'warning',
      title: 'High CPA Alert',
      message: 'Keyword "home workout" CPA increased by 25% in the last 24 hours',
      timestamp: new Date(Date.now() - 3600000),
      campaign: 'Fitness App Campaign',
      read: false
    },
    {
      id: 'alert-2',
      type: 'info',
      title: 'New High Performer',
      message: 'Keyword "strength training app" showing strong conversion rates',
      timestamp: new Date(Date.now() - 7200000),
      campaign: 'Core Keywords',
      read: false
    },
    {
      id: 'alert-3',
      type: 'critical',
      title: 'Budget Threshold',
      message: 'Daily budget 90% consumed for keyword group',
      timestamp: new Date(Date.now() - 1800000),
      campaign: 'Premium Keywords',
      read: true
    }
  ];

  const handleGlobalFilterChange = (newFilters) => {
    setFilters(newFilters);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleKeywordFilterChange = (newFilters) => {
    setKeywordFilters(newFilters);
  };

  const handleKeywordSelect = (keywordIds) => {
    if (Array.isArray(keywordIds)) {
      setSelectedKeywords(keywordIds);
    } else {
      setSelectedKeywords(prev => 
        prev?.includes(keywordIds) 
          ? prev?.filter(id => id !== keywordIds)
          : [...prev, keywordIds]
      );
    }
  };

  const handleBidAdjustment = (keywordId, recommendation) => {
    console.log('Bid adjustment:', keywordId, recommendation);
    // Implement bid adjustment logic
  };

  const handleBulkAction = (action, keywordIds) => {
    console.log('Bulk action:', action, keywordIds);
    // Implement bulk action logic
  };

  const handleKeywordEdit = (keywordId) => {
    console.log('Edit keyword:', keywordId);
    // Implement keyword edit logic
  };

  const handleExport = (config) => {
    console.log('Export config:', config);
    // Implement export logic
  };

  const handleAlertClick = (alert) => {
    console.log('Alert clicked:', alert);
  };

  const handleMarkAsRead = (alertId) => {
    console.log('Mark as read:', alertId);
  };

  const handleMarkAllAsRead = () => {
    console.log('Mark all as read');
  };

  // Filter keywords based on current filters
  const filteredKeywords = mockKeywords?.filter(keyword => {
    if (keywordFilters?.searchTerm && !keyword?.term?.toLowerCase()?.includes(keywordFilters?.searchTerm?.toLowerCase())) {
      return false;
    }
    if (keywordFilters?.matchType && keywordFilters?.matchType !== 'all' && keyword?.matchType !== keywordFilters?.matchType) {
      return false;
    }
    if (keywordFilters?.minImpressions && keyword?.impressions < parseInt(keywordFilters?.minImpressions)) {
      return false;
    }
    if (keywordFilters?.maxCPA && keyword?.cpa > parseFloat(keywordFilters?.maxCPA)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      {/* Global Filter Bar */}
      <GlobalFilterBar 
        onFilterChange={handleGlobalFilterChange}
        initialFilters={filters}
      />
      {/* Main Content */}
      <main className="pt-32 pb-8">
        <div className="max-w-[1600px] mx-auto px-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Keyword Performance Analytics
              </h1>
              <p className="text-muted-foreground">
                Deep keyword-level analysis and optimization insights for campaign performance
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <RealTimeStatusIndicator 
                connectionStatus="connected"
                dataFreshness="live"
              />
              
              <AlertNotificationBadge
                alertCount={mockAlerts?.filter(a => !a?.read)?.length}
                alerts={mockAlerts}
                onAlertClick={handleAlertClick}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
              />

              <ExportActionBar
                currentContext="keywords"
                onExport={handleExport}
                isExporting={isLoading}
              />
            </div>
          </div>

          {/* Keyword-Specific Filter Bar */}
          <KeywordFilterBar
            onFilterChange={handleKeywordFilterChange}
            filters={keywordFilters}
          />

          {/* Metrics Strip */}
          <KeywordMetricsStrip metrics={mockMetrics} />

          {/* Main Analytics Grid */}
          <div className="grid grid-cols-16 gap-6 mb-6">
            {/* Keyword Heatmap - 12 columns */}
            <div className="col-span-16 lg:col-span-12">
              <KeywordHeatmap
                keywords={filteredKeywords}
                onKeywordSelect={handleKeywordSelect}
                selectedKeywords={selectedKeywords}
              />
            </div>

            {/* Keyword Ranking Panel - 4 columns */}
            <div className="col-span-16 lg:col-span-4">
              <KeywordRankingPanel
                keywords={filteredKeywords}
                onBidAdjustment={handleBidAdjustment}
              />
            </div>
          </div>

          {/* Performance Table - Full Width */}
          <KeywordPerformanceTable
            keywords={filteredKeywords}
            onBulkAction={handleBulkAction}
            onKeywordEdit={handleKeywordEdit}
          />
        </div>
      </main>
    </div>
  );
};

export default KeywordPerformanceAnalyticsDashboard;