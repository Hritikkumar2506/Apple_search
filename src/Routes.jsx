import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import KeywordPerformanceAnalyticsDashboard from './pages/keyword-performance-analytics-dashboard';
import RealTimeCampaignMonitoringDashboard from './pages/real-time-campaign-monitoring-dashboard';
import CampaignPerformanceOverviewDashboard from './pages/campaign-performance-overview-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CampaignPerformanceOverviewDashboard />} />
        <Route path="/keyword-performance-analytics-dashboard" element={<KeywordPerformanceAnalyticsDashboard />} />
        <Route path="/real-time-campaign-monitoring-dashboard" element={<RealTimeCampaignMonitoringDashboard />} />
        <Route path="/campaign-performance-overview-dashboard" element={<CampaignPerformanceOverviewDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
