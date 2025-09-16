import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CampaignDataTable = ({ onExport = () => {} }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'spend', direction: 'desc' });
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  const campaignData = [
    {
      id: 1,
      name: "iOS App Install Campaign",
      status: "active",
      spend: 15420,
      revenue: 38550,
      roas: 2.5,
      cpa: 12.45,
      impressions: 245680,
      clicks: 8920,
      ctr: 3.63,
      conversions: 1238,
      cvr: 13.88,
      budgetUtilization: 87,
      cpaHistory: [15.2, 14.8, 13.9, 12.8, 12.45],
      lastUpdated: "2 min ago"
    },
    {
      id: 2,
      name: "Brand Keywords Campaign",
      status: "active",
      spend: 8930,
      revenue: 19650,
      roas: 2.2,
      cpa: 18.75,
      impressions: 156780,
      clicks: 5420,
      ctr: 3.46,
      conversions: 476,
      cvr: 8.78,
      budgetUtilization: 72,
      cpaHistory: [22.1, 20.5, 19.8, 19.2, 18.75],
      lastUpdated: "3 min ago"
    },
    {
      id: 3,
      name: "Competitor Keywords Campaign",
      status: "active",
      spend: 12340,
      revenue: 18510,
      roas: 1.5,
      cpa: 28.90,
      impressions: 198450,
      clicks: 6780,
      ctr: 3.42,
      conversions: 427,
      cvr: 6.30,
      budgetUtilization: 95,
      cpaHistory: [25.8, 26.9, 27.5, 28.2, 28.90],
      lastUpdated: "1 min ago"
    },
    {
      id: 4,
      name: "Generic Keywords Campaign",
      status: "warning",
      spend: 9870,
      revenue: 8883,
      roas: 0.9,
      cpa: 45.20,
      impressions: 134560,
      clicks: 4230,
      ctr: 3.14,
      conversions: 218,
      cvr: 5.15,
      budgetUtilization: 103,
      cpaHistory: [38.5, 41.2, 43.8, 44.9, 45.20],
      lastUpdated: "4 min ago"
    },
    {
      id: 5,
      name: "Holiday Promotion Campaign",
      status: "active",
      spend: 6750,
      revenue: 16200,
      roas: 2.4,
      cpa: 15.80,
      impressions: 89340,
      clicks: 3890,
      ctr: 4.35,
      conversions: 427,
      cvr: 10.98,
      budgetUtilization: 68,
      cpaHistory: [18.2, 17.5, 16.8, 16.1, 15.80],
      lastUpdated: "2 min ago"
    }
  ];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...campaignData]?.sort((a, b) => {
    if (sortConfig?.direction === 'asc') {
      return a?.[sortConfig?.key] > b?.[sortConfig?.key] ? 1 : -1;
    }
    return a?.[sortConfig?.key] < b?.[sortConfig?.key] ? 1 : -1;
  });

  const handleSelectCampaign = (campaignId) => {
    setSelectedCampaigns(prev => 
      prev?.includes(campaignId)
        ? prev?.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCampaigns(
      selectedCampaigns?.length === campaignData?.length 
        ? [] 
        : campaignData?.map(c => c?.id)
    );
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return { color: 'text-success', bg: 'bg-success/10', label: 'Active' };
      case 'warning':
        return { color: 'text-warning', bg: 'bg-warning/10', label: 'Warning' };
      case 'paused':
        return { color: 'text-muted-foreground', bg: 'bg-muted', label: 'Paused' };
      default:
        return { color: 'text-muted-foreground', bg: 'bg-muted', label: 'Unknown' };
    }
  };

  const generateSparkline = (data) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data?.map((value, index) => {
      const x = (index / (data?.length - 1)) * 40;
      const y = 12 - ((value - min) / range) * 12;
      return `${x},${y}`;
    });
    
    return `M ${points?.join(' L ')}`;
  };

  const SortableHeader = ({ children, sortKey }) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-smooth"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <Icon 
            name="ChevronUp" 
            size={10} 
            className={sortConfig?.key === sortKey && sortConfig?.direction === 'asc' ? 'text-primary' : 'text-muted-foreground/50'}
          />
          <Icon 
            name="ChevronDown" 
            size={10} 
            className={sortConfig?.key === sortKey && sortConfig?.direction === 'desc' ? 'text-primary' : 'text-muted-foreground/50'}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
            <Icon name="Table" size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Campaign Performance</h3>
            <p className="text-sm text-muted-foreground">Detailed metrics and trends</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {selectedCampaigns?.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedCampaigns?.length} selected
              </span>
              <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
                Export Selected
              </Button>
            </div>
          )}
          <Button variant="outline" size="sm" iconName="Filter" iconPosition="left">
            Filter
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedCampaigns?.length === campaignData?.length}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <SortableHeader sortKey="name">Campaign</SortableHeader>
              <SortableHeader sortKey="spend">Spend</SortableHeader>
              <SortableHeader sortKey="revenue">Revenue</SortableHeader>
              <SortableHeader sortKey="roas">ROAS</SortableHeader>
              <SortableHeader sortKey="cpa">CPA Trend</SortableHeader>
              <SortableHeader sortKey="ctr">CTR</SortableHeader>
              <SortableHeader sortKey="cvr">CVR</SortableHeader>
              <SortableHeader sortKey="budgetUtilization">Budget</SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sortedData?.map((campaign) => {
              const statusConfig = getStatusConfig(campaign?.status);
              
              return (
                <tr key={campaign?.id} className="hover:bg-muted/50 transition-smooth">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns?.includes(campaign?.id)}
                      onChange={() => handleSelectCampaign(campaign?.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${statusConfig?.bg}`}>
                        <div className={`w-full h-full rounded-full ${statusConfig?.color?.replace('text-', 'bg-')}`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {campaign?.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Updated {campaign?.lastUpdated}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">
                    ${new Intl.NumberFormat('en-US')?.format(campaign?.spend)}
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">
                    ${new Intl.NumberFormat('en-US')?.format(campaign?.revenue)}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-sm font-medium ${
                      campaign?.roas >= 2 ? 'text-success' :
                      campaign?.roas >= 1.5 ? 'text-warning' : 'text-error'
                    }`}>
                      {campaign?.roas?.toFixed(1)}x
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-6">
                        <svg width="40" height="12" className="overflow-visible">
                          <path
                            d={generateSparkline(campaign?.cpaHistory)}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className={campaign?.cpaHistory?.[4] < campaign?.cpaHistory?.[0] ? 'text-success' : 'text-error'}
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-foreground">
                        ${campaign?.cpa?.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">
                    {campaign?.ctr?.toFixed(2)}%
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">
                    {campaign?.cvr?.toFixed(2)}%
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            campaign?.budgetUtilization > 100 ? 'bg-error' :
                            campaign?.budgetUtilization > 90 ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${Math.min(campaign?.budgetUtilization, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {campaign?.budgetUtilization}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" iconName="Eye">
                        View
                      </Button>
                      <Button variant="ghost" size="sm" iconName="Edit">
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Showing {campaignData?.length} campaigns
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="ChevronLeft" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" iconName="ChevronRight" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignDataTable;