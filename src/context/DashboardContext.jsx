import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [platform, setPlatform] = useState('All Platforms');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <DashboardContext.Provider value={{ 
      timeRange, setTimeRange, 
      platform, setPlatform,
      sidebarCollapsed, setSidebarCollapsed 
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
