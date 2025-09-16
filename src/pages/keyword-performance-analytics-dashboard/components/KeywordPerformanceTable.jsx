import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const KeywordPerformanceTable = ({ keywords, onBulkAction, onKeywordEdit }) => {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'impressions', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedKeywords(keywords?.map(k => k?.id));
    } else {
      setSelectedKeywords([]);
    }
  };

  const handleSelectKeyword = (keywordId, checked) => {
    if (checked) {
      setSelectedKeywords(prev => [...prev, keywordId]);
    } else {
      setSelectedKeywords(prev => prev?.filter(id => id !== keywordId));
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedKeywords = [...keywords]?.sort((a, b) => {
    if (sortConfig?.key) {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];
      
      if (sortConfig?.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    }
    return 0;
  });

  const paginatedKeywords = sortedKeywords?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(keywords?.length / pageSize);

  const getPerformanceStatus = (keyword) => {
    if (keyword?.conversionRate > 5 && keyword?.cpa < 20) {
      return { status: 'excellent', color: 'success', label: 'Excellent' };
    } else if (keyword?.conversionRate > 3 && keyword?.cpa < 30) {
      return { status: 'good', color: 'primary', label: 'Good' };
    } else if (keyword?.conversionRate > 1) {
      return { status: 'average', color: 'warning', label: 'Average' };
    }
    return { status: 'poor', color: 'error', label: 'Poor' };
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return (
      <Icon 
        name={sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
        size={14} 
        className="text-primary" 
      />
    );
  };

  const handleBulkAction = (action) => {
    onBulkAction(action, selectedKeywords);
    setSelectedKeywords([]);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Table Header with Bulk Actions */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">
            Keyword Performance Table
          </h3>
          <span className="text-sm text-muted-foreground">
            {keywords?.length} keywords
          </span>
        </div>

        {selectedKeywords?.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedKeywords?.length} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('increase-bid')}
              iconName="ArrowUp"
              iconPosition="left"
            >
              Increase Bids
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('decrease-bid')}
              iconName="ArrowDown"
              iconPosition="left"
            >
              Decrease Bids
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('pause')}
              iconName="Pause"
              iconPosition="left"
            >
              Pause
            </Button>
          </div>
        )}
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="w-12 p-3 text-left">
                <Checkbox
                  checked={selectedKeywords?.length === keywords?.length}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="p-3 text-left">
                <button
                  onClick={() => handleSort('term')}
                  className="flex items-center space-x-1 font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Keyword</span>
                  {getSortIcon('term')}
                </button>
              </th>
              <th className="p-3 text-left">
                <button
                  onClick={() => handleSort('matchType')}
                  className="flex items-center space-x-1 font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Match Type</span>
                  {getSortIcon('matchType')}
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('impressions')}
                  className="flex items-center space-x-1 font-medium text-foreground hover:text-primary transition-smooth ml-auto"
                >
                  <span>Impressions</span>
                  {getSortIcon('impressions')}
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('clicks')}
                  className="flex items-center space-x-1 font-medium text-foreground hover:text-primary transition-smooth ml-auto"
                >
                  <span>Clicks</span>
                  {getSortIcon('clicks')}
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('conversionRate')}
                  className="flex items-center space-x-1 font-medium text-foreground hover:text-primary transition-smooth ml-auto"
                >
                  <span>Conv Rate</span>
                  {getSortIcon('conversionRate')}
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('cpa')}
                  className="flex items-center space-x-1 font-medium text-foreground hover:text-primary transition-smooth ml-auto"
                >
                  <span>CPA</span>
                  {getSortIcon('cpa')}
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('spend')}
                  className="flex items-center space-x-1 font-medium text-foreground hover:text-primary transition-smooth ml-auto"
                >
                  <span>Spend</span>
                  {getSortIcon('spend')}
                </button>
              </th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedKeywords?.map((keyword) => {
              const performance = getPerformanceStatus(keyword);
              const isSelected = selectedKeywords?.includes(keyword?.id);
              
              return (
                <tr 
                  key={keyword?.id}
                  className={`
                    border-b border-border hover:bg-muted/20 transition-smooth
                    ${isSelected ? 'bg-primary/5' : ''}
                  `}
                >
                  <td className="p-3">
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => handleSelectKeyword(keyword?.id, e?.target?.checked)}
                    />
                  </td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium text-foreground">
                        {keyword?.term}
                      </div>
                      {keyword?.searchVolume && (
                        <div className="text-xs text-muted-foreground">
                          Vol: {keyword?.searchVolume?.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`
                      px-2 py-1 rounded-md text-xs font-medium
                      ${keyword?.matchType === 'exact' ? 'bg-primary/10 text-primary' :
                        keyword?.matchType === 'phrase'? 'bg-accent/10 text-accent' : 'bg-warning/10 text-warning'}
                    `}>
                      {keyword?.matchType}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono text-sm">
                    {keyword?.impressions?.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono text-sm">
                    {keyword?.clicks?.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono text-sm">
                    {keyword?.conversionRate}%
                  </td>
                  <td className="p-3 text-right font-mono text-sm">
                    ${keyword?.cpa}
                  </td>
                  <td className="p-3 text-right font-mono text-sm">
                    ${keyword?.spend?.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${performance?.color === 'success' ? 'bg-success/10 text-success' :
                        performance?.color === 'primary' ? 'bg-primary/10 text-primary' :
                        performance?.color === 'warning'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'}
                    `}>
                      {performance?.label}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => onKeywordEdit(keyword?.id)}
                        className="p-1 hover:bg-muted rounded-md transition-smooth"
                        title="Edit keyword"
                      >
                        <Icon name="Edit" size={14} />
                      </button>
                      <button
                        className="p-1 hover:bg-muted rounded-md transition-smooth"
                        title="View details"
                      >
                        <Icon name="Eye" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e?.target?.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 text-sm border border-border rounded-md bg-background"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, keywords?.length)} of {keywords?.length}
          </span>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordPerformanceTable;