import React from 'react';
import FinancialCalendar from '@/components/calendar/FinancialCalendar';

const Calendar: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Financial Calendar</h1>
      <p className="text-muted-foreground">
        Track important financial dates, deadlines, and meetings in one place.
      </p>
      
      <FinancialCalendar />
    </div>
  );
};

export default Calendar;