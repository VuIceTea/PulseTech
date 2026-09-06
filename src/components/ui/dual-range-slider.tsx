'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatLabel?: (value: number) => string;
  className?: string;
}

export function DualRangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatLabel = (val) => val.toString(),
  className
}: DualRangeSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value);

  useEffect(() => {
    // Only update local state if parent value changes externally and is not equal to local state
    if (value[0] !== localValue[0] || value[1] !== localValue[1]) {
      setLocalValue(value);
    }
  }, [value]);

  // Debounce the onChange callback to prevent lag during dragging
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localValue);
    }, 100);
    return () => clearTimeout(handler);
  }, [localValue, onChange]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Math.min(Number(e.target.value), localValue[1] - step);
    setLocalValue([newVal, localValue[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Math.max(Number(e.target.value), localValue[0] + step);
    setLocalValue([localValue[0], newVal]);
  };

  const minPercent = ((localValue[0] - min) / (max - min)) * 100;
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100;

  return (
    <div className={cn("w-full py-4 relative", className)}>
      <div className="relative h-1.5 w-full bg-gray-200 rounded-full">
        {/* Active Track */}
        <div
          className="absolute h-full bg-[#1A56DB] rounded-full pointer-events-none"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />

        {/* Input Min */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          className="absolute w-full -top-[7px] h-5 appearance-none bg-transparent pointer-events-auto outline-none"
          style={{
            zIndex: localValue[0] > max - 100 ? 5 : 3
          }}
        />

        {/* Input Max */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="absolute w-full -top-[7px] h-5 appearance-none bg-transparent pointer-events-auto outline-none"
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm font-bold text-gray-900">{formatLabel(localValue[0])}</div>
        <div className="text-sm font-bold text-gray-900">{formatLabel(localValue[1])}</div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        input[type=range]::-webkit-slider-thumb {
          pointer-events: all;
          width: 20px;
          height: 20px;
          -webkit-appearance: none;
          background: white;
          border: 4px solid #1A56DB;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          pointer-events: all;
          width: 20px;
          height: 20px;
          background: white;
          border: 4px solid #1A56DB;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          cursor: pointer;
        }
      `}} />
    </div>
  );
}
