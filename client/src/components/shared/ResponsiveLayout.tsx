import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
  mobileBreakpoint?: number;
  tabletBreakpoint?: number;
  desktopBreakpoint?: number;
  forceLayout?: 'mobile' | 'tablet' | 'desktop';
}

/**
 * ResponsiveLayout - A component that applies different layouts based on screen size
 * 
 * This component provides consistent responsive behavior across the application,
 * handling layout changes for mobile, tablet, and desktop views.
 */
const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = '',
  mobileBreakpoint = 640,
  tabletBreakpoint = 1024,
  desktopBreakpoint = 1280,
  forceLayout
}) => {
  const isMobile = useIsMobile();
  const [screenWidth, setScreenWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [currentLayout, setCurrentLayout] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Update screen width and determine layout on resize
  useEffect(() => {
    // Set initial width
    if (typeof window !== 'undefined') {
      setScreenWidth(window.innerWidth);
    }

    // Handle resize
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setScreenWidth(window.innerWidth);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Determine layout based on screen width or forced layout
  useEffect(() => {
    if (forceLayout) {
      setCurrentLayout(forceLayout);
      return;
    }

    if (screenWidth < mobileBreakpoint) {
      setCurrentLayout('mobile');
    } else if (screenWidth < tabletBreakpoint) {
      setCurrentLayout('tablet');
    } else {
      setCurrentLayout('desktop');
    }
  }, [screenWidth, mobileBreakpoint, tabletBreakpoint, forceLayout]);

  // Apply the appropriate class based on current layout
  const layoutClassName = 
    currentLayout === 'mobile' ? mobileClassName :
    currentLayout === 'tablet' ? tabletClassName :
    desktopClassName;

  return (
    <div className={cn(className, layoutClassName)}>
      {children}
    </div>
  );
};

export default ResponsiveLayout;

// Additional exports for specialized usage
export const MobileOnly: React.FC<{children: React.ReactNode, fallback?: React.ReactNode}> = ({ 
  children, 
  fallback = null 
}) => {
  const isMobile = useIsMobile();
  return isMobile ? <>{children}</> : <>{fallback}</>;
};

export const TabletUp: React.FC<{children: React.ReactNode, fallback?: React.ReactNode}> = ({ 
  children, 
  fallback = null 
}) => {
  const isMobile = useIsMobile();
  return !isMobile ? <>{children}</> : <>{fallback}</>;
};