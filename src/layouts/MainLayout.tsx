import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import { Search, Bell, Settings, LayoutDashboard, LineChart, Star, Briefcase, Newspaper, User } from 'lucide-react';

export const MainLayout = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] flex transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col shrink-0 hidden md:flex">
        <div className="h-16 flex items-center px-6 shrink-0 border-b border-[var(--border-color)]">
          <h1 className="text-xl font-bold text-[var(--color-primary)]">Market Flow</h1>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-[var(--color-primary)] text-white font-medium">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--border-color)] transition-colors font-medium">
            <LineChart size={18} />
            <span>Market</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--border-color)] transition-colors font-medium">
            <Star size={18} />
            <span>Watchlist</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--border-color)] transition-colors font-medium">
            <Briefcase size={18} />
            <span>Portfolio</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--border-color)] transition-colors font-medium">
            <Newspaper size={18} />
            <span>News</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--border-color)] transition-colors font-medium mt-8">
            <Bell size={18} />
            <span>Alerts</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--border-color)] transition-colors font-medium">
            <Settings size={18} />
            <span>Settings</span>
          </a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-color)] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center flex-1">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-[var(--text-secondary)]" />
              </div>
              <input
                type="text"
                placeholder="Search stocks, e.g., AAPL"
                className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border-none rounded-lg text-sm text-[var(--text-color)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors">
              {isDarkMode ? '🌞' : '🌙'}
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <span className="text-sm font-medium hidden sm:block">John Doe</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
