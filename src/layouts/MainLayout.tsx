import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';

export const MainLayout = () => {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] flex flex-col transition-colors duration-300">
      <header className="h-16 border-b border-[var(--border-color)] flex items-center px-4 shrink-0">
        <h1 className="text-xl font-bold text-[var(--color-primary)]">MarketFlow</h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-[var(--border-color)] hidden md:block shrink-0">
          <nav className="p-4 space-y-2">
            <div className="p-2 rounded hover:bg-[var(--bg-secondary)] cursor-pointer">Dashboard</div>
            <div className="p-2 rounded hover:bg-[var(--bg-secondary)] cursor-pointer">Watchlist</div>
            <div className="p-2 rounded hover:bg-[var(--bg-secondary)] cursor-pointer">Portfolio</div>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
