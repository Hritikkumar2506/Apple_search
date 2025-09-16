import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const KeywordFilterBar = ({ onFilterChange, filters = {} }) => {
  const [localFilters, setLocalFilters] = useState({
    searchTerm: filters?.searchTerm || '',
    matchType: filters?.matchType || 'all',
    performanceThreshold: filters?.performanceThreshold || { min: 0, max: 100 },
    timeComparison: filters?.timeComparison || 'wow',
    minImpressions: filters?.minImpressions || '',
    maxCPA: filters?.maxCPA || '',
    ...filters
  });

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const matchTypeOptions = [
    { value: 'all', label: 'All Match Types' },
    { value: 'exact', label: 'Exact Match' },
    { value: 'phrase', label: 'Phrase Match' },
    { value: 'broad', label: 'Broad Match' }
  ];

  const timeComparisonOptions = [
    { value: 'wow', label: 'Week over Week' },
    { value: 'mom', label: 'Month over Month' },
    { value: 'yoy', label: 'Year over Year' },
    { value: 'custom', label: 'Custom Period' }
  ];

  const performanceOptions = [
    { value: 'all', label: 'All Performance' },
    { value: 'top-performers', label: 'Top Performers' },
    { value: 'underperformers', label: 'Underperformers' },
    { value: 'new-keywords', label: 'New Keywords' },
    { value: 'declining', label: 'Declining Performance' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = {
      ...localFilters,
      [key]: value
    };
    setLocalFilters(updatedFilters);
    
    // Debounce the filter change
    setTimeout(() => {
      onFilterChange(updatedFilters);
    }, 300);
  };

  const handleReset = () => {
    const resetFilters = {
      searchTerm: '',
      matchType: 'all',
      performanceThreshold: { min: 0, max: 100 },
      timeComparison: 'wow',
      minImpressions: '',
      maxCPA: '',
      performance: 'all'
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters?.searchTerm) count++;
    if (localFilters?.matchType !== 'all') count++;
    if (localFilters?.minImpressions) count++;
    if (localFilters?.maxCPA) count++;
    if (localFilters?.performance !== 'all') count++;
    return count;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Primary Filter Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4 flex-1">
          {/* Search Term Filter */}
          <div className="min-w-[300px]">
            <Input
              type="search"
              placeholder="Search keywords..."
              value={localFilters?.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e?.target?.value)}
            />
          </div>

          {/* Match Type Filter */}
          <div className="min-w-[180px]">
            <Select
              options={matchTypeOptions}
              value={localFilters?.matchType}
              onChange={(value) => handleFilterChange('matchType', value)}
              placeholder="Match type"
            />
          </div>

          {/* Time Comparison */}
          <div className="min-w-[180px]">
            <Select
              options={timeComparisonOptions}
              value={localFilters?.timeComparison}
              onChange={(value) => handleFilterChange('timeComparison', value)}
              placeholder="Time comparison"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            iconName={isAdvancedOpen ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            Advanced {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
          </Button>

          {/* Reset Button */}
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
      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Performance Filter */}
            <div>
              <Select
                label="Performance Level"
                options={performanceOptions}
                value={localFilters?.performance || 'all'}
                onChange={(value) => handleFilterChange('performance', value)}
              />
            </div>

            {/* Min Impressions */}
            <div>
              <Input
                label="Min Impressions"
                type="number"
                placeholder="e.g., 1000"
                value={localFilters?.minImpressions}
                onChange={(e) => handleFilterChange('minImpressions', e?.target?.value)}
              />
            </div>

            {/* Max CPA */}
            <div>
              <Input
                label="Max CPA ($)"
                type="number"
                placeholder="e.g., 50"
                value={localFilters?.maxCPA}
                onChange={(e) => handleFilterChange('maxCPA', e?.target?.value)}
              />
            </div>

            {/* Conversion Rate Range */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Conversion Rate Range
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localFilters?.performanceThreshold?.min}
                  onChange={(e) => handleFilterChange('performanceThreshold', {
                    ...localFilters?.performanceThreshold,
                    min: parseInt(e?.target?.value)
                  })}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-12">
                  {localFilters?.performanceThreshold?.min}%
                </span>
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localFilters?.excludePaused || false}
                onChange={(e) => handleFilterChange('excludePaused', e?.target?.checked)}
                className="rounded border-border"
              />
              <span className="text-sm text-foreground">Exclude paused keywords</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localFilters?.onlyWithConversions || false}
                onChange={(e) => handleFilterChange('onlyWithConversions', e?.target?.checked)}
                className="rounded border-border"
              />
              <span className="text-sm text-foreground">Only keywords with conversions</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localFilters?.newKeywordsOnly || false}
                onChange={(e) => handleFilterChange('newKeywordsOnly', e?.target?.checked)}
                className="rounded border-border"
              />
              <span className="text-sm text-foreground">New keywords (last 7 days)</span>
            </label>
          </div>
        </div>
      )}
      {/* Active Filters Summary */}
      {getActiveFilterCount() > 0 && (
        <div className="mt-3 flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Filter" size={14} />
          <span>
            {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} applied
          </span>
          {localFilters?.searchTerm && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              Search: "{localFilters?.searchTerm}"
            </span>
          )}
          {localFilters?.matchType !== 'all' && (
            <span className="px-2 py-1 bg-accent/10 text-accent rounded-md text-xs">
              {matchTypeOptions?.find(opt => opt?.value === localFilters?.matchType)?.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default KeywordFilterBar;