import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Props = {
  value: string;
  onChange: (v: string) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
};

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function splitHHMM(v: string): { hh: string; mm: string } {
  const m = /^(\d{2}):(\d{2})$/.exec(v);
  if (!m) return { hh: '00', mm: '00' };
  return { hh: m[1], mm: m[2] };
}

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, h) => pad2(h));
const MINUTE_OPTIONS = ['00', '15', '30', '45'];

export const TimePickerSelect: React.FC<Props> = ({ value, onChange, id, disabled, className }) => {
  const { hh, mm } = splitHHMM(value);

  const handleHour = (newHh: string) => onChange(`${newHh}:${mm}`);
  const handleMinute = (newMm: string) => onChange(`${hh}:${newMm}`);

  return (
    <div className={['flex items-center gap-2', className].filter(Boolean).join(' ')}>
      <Select
        value={hh}
        onValueChange={handleHour}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          className='w-[96px] bg-muted/40'
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          position='popper'
          side='top'
          sideOffset={6}
          className='max-h-60'
        >
          {HOUR_OPTIONS.map((h) => (
            <SelectItem
              key={h}
              value={h}
            >
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span
        aria-hidden
        className='px-1 select-none'
      >
        :
      </span>

      <Select
        value={mm}
        onValueChange={handleMinute}
        disabled={disabled}
      >
        <SelectTrigger className='w-[96px] bg-muted/40'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          position='popper'
          side='top'
          sideOffset={6}
          className='max-h-80'
        >
          {MINUTE_OPTIONS.map((m) => (
            <SelectItem
              key={m}
              value={m}
            >
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
