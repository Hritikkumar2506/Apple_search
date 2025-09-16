import React, { useState, useEffect } from 'react';
import Select from './Select';
import Input from './Input';
import Button from './Button';
import Icon from '../AppIcon';

const GlobalFilterBar = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    dateRange: initialFilters?.dateRange || 'last-7-days',
    campaigns: initialFilters?.campaigns || [],
    adGroups: initialFilters?.adGroups || [],
    keywords: initialFilters?.keywords || '',
    ...initialFilters
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-14-days', label: 'Last 14 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const campaignOptions = [
    { value: 'campaign-1', label: 'iOS App Install Campaign' },
    { value: 'campaign-2', label: 'Brand Keywords Campaign' },
    { value: 'campaign-3', label: 'Competitor Keywords Campaign' },
    { value: 'campaign-4', label: 'Generic Keywords Campaign' },
    { value: 'campaign-5', label: 'Holiday Promotion Campaign' }
  ];

  const adGroupOptions = [
    { value: 'adgroup-1', label: 'Core Keywords' },
    { value: 'adgroup-2', label: 'Long Tail Keywords' },
    { value: 'adgroup-3', label: 'Brand Terms' },
    { value: 'adgroup-4', label: 'Competitor Terms' },
    { value: 'adgroup-5', label: 'Category Terms' }
  ];

  // Debounced filter change handler
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange?.(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, onFilterChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleReset = () => {
    const resetFilters = {
      dateRange: 'last-7-days',
      campaigns: [],
      adGroups: [],
      keywords: ''
    };
    setFilters(resetFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.campaigns?.length > 0) count++;
    if (filters?.adGroups?.length > 0) count++;
    if (filters?.keywords?.trim()) count++;
    return count;
  };

  return (
    <div className="sticky top-16 z-[999] bg-card border-b border-border">
      <div className="px-6 py-4">
        {/* Primary Filters Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Date Range */}
            <div className="min-w-[200px]">
              <Select
                options={dateRangeOptions}
                value={filters?.dateRange}
                onChange={(value) => handleFilterChange('dateRange', value)}
                placeholder="Select date range"
              />
            </div>

            {/* Campaign Filter */}
            <div className="min-w-[250px]">
              <Select
                options={campaignOptions}
                value={filters?.campaigns}
                onChange={(value) => handleFilterChange('campaigns', value)}
                placeholder="All campaigns"
                multiple
                searchable
                clearable
              />
            </div>

            {/* Mobile Filter Toggle */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                iconPosition="right"
              >
                Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              <Button variant="ghost" size="sm" iconName="RefreshCw" iconPosition="left">
                Refresh
              </Button>
              <Button variant="ghost" size="sm" iconName="Save" iconPosition="left">
                Save View
              </Button>
            </div>

            {/* Reset Filters */}
            {getActiveFilterCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                iconName="X"
                iconPosition="left"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Secondary Filters Row - Desktop Always Visible, Mobile Expandable */}
        <div className={`
          mt-4 transition-progressive overflow-hidden
          ${isExpanded ? 'block' : 'hidden md:block'}
        `}>
          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
            {/* Ad Group Filter */}
            <div className="min-w-[200px]">
              <Select
                options={adGroupOptions}
                value={filters?.adGroups}
                onChange={(value) => handleFilterChange('adGroups', value)}
                placeholder="All ad groups"
                multiple
                searchable
                clearable
              />
            </div>

            {/* Keyword Search */}
            <div className="min-w-[250px]">
              <Input
                type="search"
                placeholder="Search keywords..."
                value={filters?.keywords}
                onChange={(e) => handleFilterChange('keywords', e?.target?.value)}
              />
            </div>

            {/* Performance Filters */}
            <div className="flex items-center space-x-3">
              <Select
                options={[
                  { value: 'all', label: 'All Performance' },
                  { value: 'high-performers', label: 'High Performers' },
                  { value: 'low-performers', label: 'Low Performers' },
                  { value: 'new-keywords', label: 'New Keywords' }
                ]}
                value={filters?.performance || 'all'}
                onChange={(value) => handleFilterChange('performance', value)}
                placeholder="Performance"
              />
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        {getActiveFilterCount() > 0 && (
          <div className="mt-3 flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Filter" size={14} />
            <span>
              {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} applied
            </span>
            {filters?.campaigns?.length > 0 && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                {filters?.campaigns?.length} campaign{filters?.campaigns?.length > 1 ? 's' : ''}
              </span>
            )}
            {filters?.adGroups?.length > 0 && (
              <span className="px-2 py-1 bg-accent/10 text-accent rounded-md text-xs">
                {filters?.adGroups?.length} ad group{filters?.adGroups?.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalFilterBar;