import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';

const ExportActionBar = ({ 
  currentContext = 'overview',
  onExport = () => {},
  isExporting = false,
  availableFormats = ['csv', 'xlsx', 'pdf'],
  availableTimeRanges = ['current', 'last-7-days', 'last-30-days', 'custom']
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [exportConfig, setExportConfig] = useState({
    format: 'csv',
    timeRange: 'current',
    includeCharts: true,
    includeFilters: true
  });

  const formatOptions = [
    { value: 'csv', label: 'CSV', description: 'Comma-separated values' },
    { value: 'xlsx', label: 'Excel', description: 'Microsoft Excel format' },
    { value: 'pdf', label: 'PDF', description: 'Portable document format' },
    { value: 'json', label: 'JSON', description: 'JavaScript object notation' }
  ]?.filter(option => availableFormats?.includes(option?.value));

  const timeRangeOptions = [
    { value: 'current', label: 'Current View', description: 'Export visible data' },
    { value: 'last-7-days', label: 'Last 7 Days', description: 'Include last 7 days' },
    { value: 'last-30-days', label: 'Last 30 Days', description: 'Include last 30 days' },
    { value: 'custom', label: 'Custom Range', description: 'Select date range' }
  ]?.filter(option => availableTimeRanges?.includes(option?.value));

  const getContextLabel = () => {
    switch (currentContext) {
      case 'overview':
        return 'Campaign Performance Overview';
      case 'monitoring':
        return 'Real-Time Monitoring Data';
      case 'keywords':
        return 'Keyword Analytics Report';
      default:
        return 'Analytics Report';
    }
  };

  const handleQuickExport = (format) => {
    const config = {
      ...exportConfig,
      format,
      context: currentContext
    };
    onExport(config);
    setIsDropdownOpen(false);
  };

  const handleAdvancedExport = () => {
    const config = {
      ...exportConfig,
      context: currentContext
    };
    onExport(config);
    setIsDropdownOpen(false);
  };

  const handleConfigChange = (key, value) => {
    setExportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Quick Export Buttons - Desktop */}
      <div className="hidden lg:flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickExport('csv')}
          disabled={isExporting}
          iconName="Download"
          iconPosition="left"
        >
          CSV
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickExport('xlsx')}
          disabled={isExporting}
          iconName="FileSpreadsheet"
          iconPosition="left"
        >
          Excel
        </Button>
      </div>
      {/* Export Dropdown */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isExporting}
          loading={isExporting}
          iconName="Download"
          iconPosition="left"
        >
          <span className="hidden sm:inline">Export</span>
        </Button>

        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[1099]"
              onClick={() => setIsDropdownOpen(false)}
            />
            
            {/* Dropdown Content */}
            <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-md shadow-modal z-[1100]">
              {/* Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Download" size={16} />
                  <h3 className="font-medium text-popover-foreground">
                    Export Data
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getContextLabel()}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-b border-border">
                <h4 className="text-sm font-medium text-popover-foreground mb-3">
                  Quick Export
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {formatOptions?.slice(0, 4)?.map((format) => (
                    <button
                      key={format?.value}
                      onClick={() => handleQuickExport(format?.value)}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-smooth text-left"
                      disabled={isExporting}
                    >
                      <Icon 
                        name={format?.value === 'csv' ? 'FileText' : 
                              format?.value === 'xlsx' ? 'FileSpreadsheet' :
                              format?.value === 'pdf' ? 'FileImage' : 'File'} 
                        size={16} 
                      />
                      <div>
                        <div className="text-sm font-medium">{format?.label}</div>
                        <div className="text-xs text-muted-foreground">{format?.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Options */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-popover-foreground mb-3">
                  Advanced Options
                </h4>
                
                <div className="space-y-3">
                  {/* Format Selection */}
                  <div>
                    <Select
                      label="Format"
                      options={formatOptions}
                      value={exportConfig?.format}
                      onChange={(value) => handleConfigChange('format', value)}
                    />
                  </div>

                  {/* Time Range */}
                  <div>
                    <Select
                      label="Time Range"
                      options={timeRangeOptions}
                      value={exportConfig?.timeRange}
                      onChange={(value) => handleConfigChange('timeRange', value)}
                    />
                  </div>

                  {/* Additional Options */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={exportConfig?.includeCharts}
                        onChange={(e) => handleConfigChange('includeCharts', e?.target?.checked)}
                        className="rounded border-border"
                      />
                      <span className="text-sm">Include charts (PDF only)</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={exportConfig?.includeFilters}
                        onChange={(e) => handleConfigChange('includeFilters', e?.target?.checked)}
                        className="rounded border-border"
                      />
                      <span className="text-sm">Include applied filters</span>
                    </label>
                  </div>
                </div>

                {/* Export Button */}
                <div className="mt-4 pt-3 border-t border-border">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={handleAdvancedExport}
                    disabled={isExporting}
                    loading={isExporting}
                    iconName="Download"
                    iconPosition="left"
                  >
                    Export {exportConfig?.format?.toUpperCase()}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExportActionBar;