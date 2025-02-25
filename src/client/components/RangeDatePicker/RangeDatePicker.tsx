import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/client/components/ui/button';
import { Calendar } from '@/client/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/client/components/ui/popover';
import { cn } from '@/client/lib/utils';

export const RangeDatePicker = ({
    className
}: React.HTMLAttributes<HTMLDivElement>) => {
    const [date, setDate] = React.useState<DateRange | undefined>();

    useEffect(() => {
        const startDate = new Date(
            !hasAcademicYearStarted
                ? currentAcademicYear - 1
                : currentAcademicYear,
            8,
            1
        );
        const endDate = new Date(
            !hasAcademicYearStarted
                ? currentAcademicYear
                : currentAcademicYear + 1,
            5,
            30
        );

        setDate({ from: startDate, to: endDate });
    }, []);

    const CurrentDate = new Date();
    const currentAcademicYear = CurrentDate.getFullYear();
    const hasAcademicYearStarted = CurrentDate.getMonth() >= 8;

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                            'w-[300px] justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'LLL dd, y')} -{' '}
                                    {format(date.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};
