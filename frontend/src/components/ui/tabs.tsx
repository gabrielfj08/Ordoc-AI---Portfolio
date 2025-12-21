import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  children: React.ReactNode;
  defaultValue: string;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export function Tabs({ children, defaultValue, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-lg bg-transparent p-0 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ children, value, className = '' }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      data-state={isActive ? 'active' : 'inactive'}
      className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2
        disabled:pointer-events-none disabled:opacity-50 border border-transparent
        ${isActive
          ? 'bg-orange-50 text-orange-700 shadow-none border-orange-100'
          : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, className = '' }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }

  const { activeTab } = context;

  if (activeTab !== value) {
    return null;
  }

  return (
    <div className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
}
