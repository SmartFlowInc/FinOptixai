import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'default';
type Density = 'compact' | 'normal' | 'spacious';

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  density: Density;
  setTheme: (theme: Theme) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
  setDensity: (density: Density) => void;
  resolvedTheme: 'light' | 'dark';
  isInitialized: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  colorScheme: 'default',
  density: 'normal',
  setTheme: () => {},
  setColorScheme: () => {},
  setDensity: () => {},
  resolvedTheme: 'light',
  isInitialized: false
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('default');
  const [density, setDensityState] = useState<Density>('normal');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from local storage
  useEffect(() => {
    const storedTheme = localStorage.getItem('ui-theme') as Theme;
    const storedColorScheme = localStorage.getItem('ui-color-scheme') as ColorScheme;
    const storedDensity = localStorage.getItem('ui-density') as Density;
    
    if (storedTheme) {
      setThemeState(storedTheme);
    }
    
    if (storedColorScheme) {
      setColorSchemeState(storedColorScheme);
    }
    
    if (storedDensity) {
      setDensityState(storedDensity);
    }
    
    setIsInitialized(true);
  }, []);

  // Update resolved theme based on system preference or explicit setting
  useEffect(() => {
    const updateResolvedTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setResolvedTheme(systemTheme);
      } else {
        setResolvedTheme(theme === 'dark' ? 'dark' : 'light');
      }
    };

    updateResolvedTheme();

    // Listen for changes to system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => updateResolvedTheme();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Apply theme, color scheme and density to document element
  useEffect(() => {
    if (!isInitialized) return;
    
    // Update document classes for theme
    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Update document classes for color scheme
    document.documentElement.setAttribute('data-color-scheme', colorScheme);
    
    // Update document classes for density
    document.documentElement.setAttribute('data-density', density);
    
  }, [resolvedTheme, colorScheme, density, isInitialized]);

  // Theme setter with local storage persistence
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('ui-theme', newTheme);
  };

  // Color scheme setter with local storage persistence
  const setColorScheme = (newColorScheme: ColorScheme) => {
    setColorSchemeState(newColorScheme);
    localStorage.setItem('ui-color-scheme', newColorScheme);
  };

  // Density setter with local storage persistence
  const setDensity = (newDensity: Density) => {
    setDensityState(newDensity);
    localStorage.setItem('ui-density', newDensity);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorScheme,
        density,
        setTheme,
        setColorScheme,
        setDensity,
        resolvedTheme,
        isInitialized
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// UI-related helper functions
export function getSpacingByDensity(density: Density) {
  switch (density) {
    case 'compact':
      return {
        cardPadding: 'p-2',
        sectionGap: 'gap-2',
        contentPadding: 'p-3',
        itemSpacing: 'space-y-2'
      };
    case 'spacious':
      return {
        cardPadding: 'p-6',
        sectionGap: 'gap-6',
        contentPadding: 'p-8',
        itemSpacing: 'space-y-6'
      };
    default: // 'normal'
      return {
        cardPadding: 'p-4',
        sectionGap: 'gap-4',
        contentPadding: 'p-6',
        itemSpacing: 'space-y-4'
      };
  }
}

// Theme-specific components
export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="flex items-center space-x-2">
      <button
        className={`px-3 py-1 text-sm rounded-md ${theme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
        onClick={() => setTheme('light')}
      >
        Light
      </button>
      <button
        className={`px-3 py-1 text-sm rounded-md ${theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
        onClick={() => setTheme('dark')}
      >
        Dark
      </button>
      <button
        className={`px-3 py-1 text-sm rounded-md ${theme === 'system' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
        onClick={() => setTheme('system')}
      >
        System
      </button>
    </div>
  );
};

export const DensityToggle: React.FC = () => {
  const { density, setDensity } = useTheme();
  
  return (
    <div className="flex items-center space-x-2">
      <button
        className={`px-3 py-1 text-sm rounded-md ${density === 'compact' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
        onClick={() => setDensity('compact')}
      >
        Compact
      </button>
      <button
        className={`px-3 py-1 text-sm rounded-md ${density === 'normal' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
        onClick={() => setDensity('normal')}
      >
        Normal
      </button>
      <button
        className={`px-3 py-1 text-sm rounded-md ${density === 'spacious' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
        onClick={() => setDensity('spacious')}
      >
        Spacious
      </button>
    </div>
  );
};