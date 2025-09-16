import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const KeywordRankingPanel = ({ keywords, onBidAdjustment }) => {
  const [sortBy, setSortBy] = useState('conversionRate');
  const [sortOrder, setSortOrder] = useState('desc');

  const sortedKeywords = [...keywords]?.sort((a, b) => {
    const aValue = a?.[sortBy];
    const bValue = b?.[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const topKeywords = sortedKeywords?.slice(0, 10);

  const getBidRecommendation = (keyword) => {
    const avgCPA = 25; // Mock average CPA
    const targetCPA = 20; // Mock target CPA
    
    if (keyword?.cpa < targetCPA && keyword?.conversionRate > 3) {
      return { action: 'increase', percentage: 15, color: 'success' };
    } else if (keyword?.cpa > avgCPA && keyword?.conversionRate < 2) {
      return { action: 'decrease', percentage: 20, color: 'error' };
    }
    return { action: 'maintain', percentage: 0, color: 'muted' };
  };

  const getTrendIcon = (trend) => {
    if (trend > 5) return { icon: 'TrendingUp', color: 'text-success' };
    if (trend < -5) return { icon: 'TrendingDown', color: 'text-error' };
    return { icon: 'Minus', color: 'text-muted-foreground' };
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Top Keywords
          </h3>
          <p className="text-sm text-muted-foreground">
            Ranked by performance with bid recommendations
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-3 py-1.5 text-sm border border-border rounded-md bg-background"
          >
            <option value="conversionRate">Conversion Rate</option>
            <option value="impressions">Impressions</option>
            <option value="spend">Spend</option>
            <option value="cpa">CPA</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1.5 hover:bg-muted rounded-md transition-smooth"
          >
            <Icon 
              name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
              size={16} 
            />
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {topKeywords?.map((keyword, index) => {
          const bidRec = getBidRecommendation(keyword);
          const trendConfig = getTrendIcon(keyword?.searchVolumeTrend);
          
          return (
            <div 
              key={keyword?.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-foreground truncate">
                      {keyword?.term}
                    </h4>
                    <div className={`flex items-center space-x-1 ${trendConfig?.color}`}>
                      <Icon name={trendConfig?.icon} size={12} />
                      <span className="text-xs">
                        {Math.abs(keyword?.searchVolumeTrend)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>Vol: {keyword?.searchVolume?.toLocaleString() || 'N/A'}</span>
                    <span>Conv: {keyword?.conversionRate}%</span>
                    <span>CPA: ${keyword?.cpa}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Bid Recommendation */}
                <div className={`
                  flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium
                  ${bidRec?.color === 'success' ? 'bg-success/10 text-success' :
                    bidRec?.color === 'error'? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'}
                `}>
                  <Icon 
                    name={bidRec?.action === 'increase' ? 'ArrowUp' : 
                          bidRec?.action === 'decrease' ? 'ArrowDown' : 'Minus'} 
                    size={10} 
                  />
                  <span>
                    {bidRec?.action === 'maintain' ? 'Hold' : `${bidRec?.percentage}%`}
                  </span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => onBidAdjustment(keyword?.id, bidRec)}
                  className="p-1.5 hover:bg-muted rounded-md transition-smooth"
                  title="Apply bid recommendation"
                >
                  <Icon name="Settings" size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">
              {topKeywords?.filter(k => getBidRecommendation(k)?.action === 'increase')?.length}
            </div>
            <div className="text-xs text-success">Increase Bids</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {topKeywords?.filter(k => getBidRecommendation(k)?.action === 'maintain')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Maintain</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {topKeywords?.filter(k => getBidRecommendation(k)?.action === 'decrease')?.length}
            </div>
            <div className="text-xs text-error">Decrease Bids</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordRankingPanel;