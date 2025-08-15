'use client';
import React, { useEffect, useState } from 'react';
import { DateRange, RangeKeyDict } from 'react-date-range';
import { format, subDays } from 'date-fns';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const presets = [
  { label: 'Today', range: [new Date(), new Date()] },
  { label: 'Yesterday', range: [subDays(new Date(), 1), subDays(new Date(), 1)] },
  { label: 'Last 7 Days', range: [subDays(new Date(), 6), new Date()] },
  { label: 'Last 28 Days', range: [subDays(new Date(), 27), new Date()] },
];

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onChange?: (start: Date, end: Date) => void;
}

export default function DateRangePickerComponent({
  startDate = subDays(new Date(), 6),
  endDate = new Date(),
  onChange,
}: DateRangePickerProps) {
  const [range, setRange] = useState<any[]>([
    {
      startDate,
      endDate,
      key: 'selection',
    },
  ]);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setRange([{ startDate, endDate, key: 'selection' }]);
  }, [startDate, endDate]);

  const handlePreset = (start: Date, end: Date) => {
    setRange([{ startDate: start, endDate: end, key: 'selection' }]);
    if (onChange) onChange(start, end);
    setShowPicker(false);
  };

  const handleApply = () => {
    const { startDate, endDate } = range[0];
    if (onChange) onChange(startDate, endDate);
    setShowPicker(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="px-4 py-2 border rounded-md shadow-sm text-gray-500 dark:text-gray-400"
      >
        {`${format(range[0].startDate, 'MMM dd, yyyy')} - ${format(range[0].endDate, 'MMM dd, yyyy')}`}
      </button>

      {showPicker && (
        <div className="absolute z-50 mt-2 p-4 bg-white dark:bg-black border rounded-lg shadow-lg">
          <div className="flex gap-4">
            <div className="flex flex-col space-y-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  className="px-3 py-2 border text-blue-600 rounded hover:bg-blue-50"
                  onClick={() => handlePreset(preset.range[0], preset.range[1])}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-black">
              <DateRange
                editableDateInputs={true}
                onChange={(item: RangeKeyDict) => setRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={range}
                months={1}
                direction="horizontal"
                color="#3d91ff"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setShowPicker(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-red-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded hover:bg-indigo-600"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
