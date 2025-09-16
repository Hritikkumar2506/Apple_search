import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const KeywordHeatmap = ({ keywords, onKeywordSelect, selectedKeywords = [] }) => {
  const [hoveredKeyword, setHoveredKeyword] = useState(null);
  const [isLassoMode, setIsLassoMode] = useState(false);
  const [lassoPath, setLassoPath] = useState([]);
  const svgRef = useRef(null);

  const width = 800;
  const height = 400;
  const padding = 40;

  // Scale functions
  const xScale = (impressions) => {
    const maxImpressions = Math.max(...keywords?.map(k => k?.impressions));
    return (impressions / maxImpressions) * (width - 2 * padding) + padding;
  };

  const yScale = (conversionRate) => {
    const maxRate = Math.max(...keywords?.map(k => k?.conversionRate));
    return height - padding - (conversionRate / maxRate) * (height - 2 * padding);
  };

  const bubbleSize = (spend) => {
    const maxSpend = Math.max(...keywords?.map(k => k?.spend));
    const minSize = 4;
    const maxSize = 20;
    return minSize + (spend / maxSpend) * (maxSize - minSize);
  };

  const getPerformanceZone = (keyword) => {
    const avgConversionRate = keywords?.reduce((sum, k) => sum + k?.conversionRate, 0) / keywords?.length;
    const avgImpressions = keywords?.reduce((sum, k) => sum + k?.impressions, 0) / keywords?.length;

    if (keyword?.conversionRate > avgConversionRate && keyword?.impressions > avgImpressions) {
      return { zone: 'high-performer', color: '#10B981' };
    } else if (keyword?.conversionRate < avgConversionRate && keyword?.impressions < avgImpressions) {
      return { zone: 'low-performer', color: '#DC2626' };
    } else if (keyword?.conversionRate > avgConversionRate) {
      return { zone: 'high-converting', color: '#3B82F6' };
    } else {
      return { zone: 'high-volume', color: '#F59E0B' };
    }
  };

  const handleLassoStart = (e) => {
    if (!isLassoMode) return;
    const rect = svgRef?.current?.getBoundingClientRect();
    const x = e?.clientX - rect?.left;
    const y = e?.clientY - rect?.top;
    setLassoPath([{ x, y }]);
  };

  const handleLassoMove = (e) => {
    if (!isLassoMode || lassoPath?.length === 0) return;
    const rect = svgRef?.current?.getBoundingClientRect();
    const x = e?.clientX - rect?.left;
    const y = e?.clientY - rect?.top;
    setLassoPath(prev => [...prev, { x, y }]);
  };

  const handleLassoEnd = () => {
    if (!isLassoMode || lassoPath?.length < 3) {
      setLassoPath([]);
      return;
    }

    // Simple point-in-polygon check for lasso selection
    const selectedIds = keywords?.filter(keyword => {
      const x = xScale(keyword?.impressions);
      const y = yScale(keyword?.conversionRate);
      return isPointInPolygon({ x, y }, lassoPath);
    })?.map(k => k?.id);

    onKeywordSelect(selectedIds);
    setLassoPath([]);
  };

  const isPointInPolygon = (point, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon?.length - 1; i < polygon?.length; j = i++) {
      if (((polygon?.[i]?.y > point?.y) !== (polygon?.[j]?.y > point?.y)) &&
          (point?.x < (polygon?.[j]?.x - polygon?.[i]?.x) * (point?.y - polygon?.[i]?.y) / (polygon?.[j]?.y - polygon?.[i]?.y) + polygon?.[i]?.x)) {
        inside = !inside;
      }
    }
    return inside;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Keyword Performance Heatmap
          </h3>
          <p className="text-sm text-muted-foreground">
            Impressions vs Conversion Rate (bubble size = spend)
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsLassoMode(!isLassoMode)}
            className={`
              flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-smooth
              ${isLassoMode 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:text-foreground'
              }
            `}
          >
            <Icon name="Lasso" size={14} />
            <span>Lasso Select</span>
          </button>
          
          <button
            onClick={() => onKeywordSelect([])}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium bg-muted text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Icon name="X" size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>
      <div className="relative">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="border border-border rounded-md bg-background"
          onMouseDown={handleLassoStart}
          onMouseMove={handleLassoMove}
          onMouseUp={handleLassoEnd}
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(229, 231, 235)" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Axes */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} 
                stroke="rgb(107, 114, 128)" strokeWidth="2" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} 
                stroke="rgb(107, 114, 128)" strokeWidth="2" />

          {/* Axis labels */}
          <text x={width / 2} y={height - 10} textAnchor="middle" className="fill-muted-foreground text-sm">
            Impressions
          </text>
          <text x={15} y={height / 2} textAnchor="middle" transform={`rotate(-90, 15, ${height / 2})`} 
                className="fill-muted-foreground text-sm">
            Conversion Rate (%)
          </text>

          {/* Performance zones background */}
          <rect x={padding + (width - 2 * padding) / 2} y={padding} 
                width={(width - 2 * padding) / 2} height={(height - 2 * padding) / 2}
                fill="#10B981" opacity="0.1" />
          <text x={padding + (width - 2 * padding) * 0.75} y={padding + 20} 
                className="fill-success text-xs font-medium">High Performers</text>

          {/* Lasso path */}
          {lassoPath?.length > 0 && (
            <path
              d={`M ${lassoPath?.map(p => `${p?.x},${p?.y}`)?.join(' L ')}`}
              fill="rgba(59, 130, 246, 0.1)"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}

          {/* Keywords as bubbles */}
          {keywords?.map((keyword) => {
            const x = xScale(keyword?.impressions);
            const y = yScale(keyword?.conversionRate);
            const size = bubbleSize(keyword?.spend);
            const performance = getPerformanceZone(keyword);
            const isSelected = selectedKeywords?.includes(keyword?.id);
            const isHovered = hoveredKeyword?.id === keyword?.id;

            return (
              <g key={keyword?.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={size}
                  fill={performance?.color}
                  opacity={isSelected ? 0.8 : 0.6}
                  stroke={isSelected ? '#1E40AF' : 'white'}
                  strokeWidth={isSelected ? 3 : 1}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredKeyword(keyword)}
                  onMouseLeave={() => setHoveredKeyword(null)}
                  onClick={() => onKeywordSelect([keyword?.id])}
                />
                {isHovered && (
                  <g>
                    <rect
                      x={x + size + 5}
                      y={y - 30}
                      width="200"
                      height="60"
                      fill="rgb(17, 24, 39)"
                      stroke="rgb(75, 85, 99)"
                      rx="4"
                      opacity="0.95"
                    />
                    <text x={x + size + 15} y={y - 15} className="fill-white text-sm font-medium">
                      {keyword?.term}
                    </text>
                    <text x={x + size + 15} y={y - 2} className="fill-gray-300 text-xs">
                      Impressions: {keyword?.impressions?.toLocaleString()}
                    </text>
                    <text x={x + size + 15} y={y + 12} className="fill-gray-300 text-xs">
                      Conv Rate: {keyword?.conversionRate}% | Spend: ${keyword?.spend}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-card border border-border rounded-lg p-3 space-y-2">
          <h4 className="text-sm font-medium text-foreground mb-2">Performance Zones</h4>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-xs text-muted-foreground">High Performers</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-xs text-muted-foreground">High Converting</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span className="text-xs text-muted-foreground">High Volume</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-error"></div>
            <span className="text-xs text-muted-foreground">Low Performers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordHeatmap;