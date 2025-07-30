'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="relative overflow-hidden transition-all duration-300 hover:shadow-md"
    >
      <div className="relative flex items-center gap-2">
        {theme === 'light' ? (
          <Moon className="h-4 w-4 transition-transform duration-300" />
        ) : (
          <Sun className="h-4 w-4 transition-transform duration-300" />
        )}
        <span className="hidden sm:inline">
          {theme === 'light' ? 'Dark' : 'Light'}
        </span>
      </div>
    </Button>
  );
}