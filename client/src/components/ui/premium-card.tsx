import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface PremiumCardProps {
  title?: string;
  description?: string;
  headerContent?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  accentColor?: string;
  showAccent?: boolean;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  title,
  description,
  headerContent,
  children,
  footer,
  className = '',
  accentColor = 'from-[#2D71A8] to-[#4D8EC3]',
  showAccent = true,
}) => {
  return (
    <Card className={`border border-slate-100 shadow-md overflow-hidden ${className}`}>
      {showAccent && (
        <div className={`h-1.5 w-full bg-gradient-to-r ${accentColor}`}></div>
      )}
      
      {(title || description || headerContent) && (
        <CardHeader className="bg-white">
          {headerContent ? (
            headerContent
          ) : (
            <>
              {title && <CardTitle className="text-[#0F1829]">{title}</CardTitle>}
              {description && <CardDescription className="text-[#4D8EC3]">{description}</CardDescription>}
            </>
          )}
        </CardHeader>
      )}
      
      <CardContent className={!title && !description && !headerContent ? 'pt-6' : ''}>
        {children}
      </CardContent>
      
      {footer && (
        <CardFooter className="border-t border-slate-100">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default PremiumCard;