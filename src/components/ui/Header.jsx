import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const navigationItems = [
    {
      path: '/campaign-performance-overview-dashboard',
      label: 'Overview',
      icon: 'BarChart3',
      description: 'Strategic campaign performance hub'
    },
    {
      path: '/real-time-campaign-monitoring-dashboard',
      label: 'Live Monitoring',
      icon: 'Activity',
      description: 'Real-time operational command center'
    },
    {
      path: '/keyword-performance-analytics-dashboard',
      label: 'Keyword Analytics',
      icon: 'Search',
      description: 'Specialized deep-dive analysis workspace'
    }
  ];

  const moreItems = [
    { label: 'Settings', icon: 'Settings', path: '/settings' },
    { label: 'Help', icon: 'HelpCircle', path: '/help' },
    { label: 'Admin', icon: 'Shield', path: '/admin' }
  ];

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const handleMoreItemClick = (path) => {
    setIsMoreMenuOpen(false);
    window.location.href = path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="Search" size={20} color="white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground leading-tight">
                Apple Search Ads
              </h1>
              <span className="text-xs text-muted-foreground leading-tight">
                Analytics
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth
                ${isActiveRoute(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
              title={item?.description}
            >
              <Icon name={item?.icon} size={16} strokeWidth={2} />
              <span>{item?.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Real-Time Status Indicator */}
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-success/10 rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-success">Live</span>
            <span className="text-xs text-muted-foreground">
              {new Date()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Alert Notification Badge */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Icon name="Bell" size={18} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
          </div>

          {/* Export Action */}
          <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
            Export
          </Button>

          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            >
              <Icon name="MoreHorizontal" size={18} />
            </Button>

            {isMoreMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-[1099]"
                  onClick={() => setIsMoreMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-modal z-[1100]">
                  <div className="py-1">
                    {moreItems?.map((item) => (
                      <button
                        key={item?.path}
                        onClick={() => handleMoreItemClick(item?.path)}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                      >
                        <Icon name={item?.icon} size={16} />
                        <span>{item?.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <Icon name="Menu" size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Navigation Menu - Hidden by default, would be shown via state */}
      <div className="hidden md:hidden border-t border-border bg-card">
        <nav className="px-4 py-3 space-y-1">
          {navigationItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`
                flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-smooth
                ${isActiveRoute(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              <Icon name={item?.icon} size={18} strokeWidth={2} />
              <span>{item?.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;