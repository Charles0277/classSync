import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';
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
    date,
    setDate,
    hiddenDates,
    className
}: {
    date: DateRange;
    setDate: (date: DateRange | undefined) => void;
    hiddenDates: DateRange;
} & React.HTMLAttributes<HTMLDivElement>) => {
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
                        hidden={{
                            before: hiddenDates.from!,
                            after: hiddenDates.to
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};
