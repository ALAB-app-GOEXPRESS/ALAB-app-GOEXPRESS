import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { nowHHMM, todayYYYYMMDD, roundToStepHHMM } from '@/utils/dateTime';
import { isValidDateYYYYMMDD, isValidTimeHHMM } from '@/utils/validators';
import { StationNameMap } from '@/constants/Station';
import { TimePickerSelect } from '@/components/TimePickerSelect';

type TrainSearchParams = {
  from: string;
  to: string;
  date: string;
  time: string;
};

const toQueryString = (p: TrainSearchParams) => {
  const sp = new URLSearchParams();
  sp.set('from', p.from);
  sp.set('to', p.to);
  sp.set('date', p.date);
  sp.set('time', p.time);
  return sp.toString();
};

export const TrainSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toastShownRef = useRef(false);

  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [date, setDate] = useState<string>(todayYYYYMMDD());
  const [time, setTime] = useState<string>(() => roundToStepHHMM(nowHHMM(), 15));

  const [error, setError] = useState<string>('');

  // ログアウト成功時のトースト表示
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('logout') === 'success' && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.success('ログアウトしました', {
        position: 'bottom-right',
        duration: 5000,
      });
      // URLをクリア
      navigate('/search', { replace: true });
    }
  }, [location.search, navigate]);

  const setAndFalse = (message: string) => {
    setError(message);
    return false;
  };

  const validate = (): boolean => {
    if (!from) return setAndFalse('乗車駅を選択してください。');
    if (!to) return setAndFalse('降車駅を選択してください。');
    if (from === to) return setAndFalse('乗車駅と降車駅は別の駅を選択してください。');
    if (!date) return setAndFalse('乗車日を入力してください。');
    if (!isValidDateYYYYMMDD(date)) return setAndFalse('乗車日は YYYY-MM-DD 形式で入力してください。');
    if (!time) return setAndFalse('出発時刻を入力してください。');
    if (!isValidTimeHHMM(time)) return setAndFalse('出発時刻は HH:mm 形式で入力してください。');

    setError('');
    return true;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const params: TrainSearchParams = { from, to, date, time };
    navigate(`/results?${toQueryString(params)}`);
  };

  return (
    <div className='min-h-[calc(100vh-64px)] bg-background pt-10'>
      <div className='mx-auto w-full max-w-xl rounded-xl border bg-card p-6 sm:p-8'>
        <div className='mb-8 text-2xl font-bold'>新幹線をさがす</div>

        <form
          onSubmit={onSubmit}
          className='space-y-6'
        >
          <div className='grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end'>
            <div className='space-y-2'>
              <Label htmlFor='from'>乗車駅</Label>
              <Select
                value={from}
                onValueChange={setFrom}
              >
                <SelectTrigger
                  id='from'
                  className='w-full bg-muted/40'
                >
                  <SelectValue placeholder='駅を選択' />
                </SelectTrigger>
                <SelectContent
                  position='popper'
                  className='max-h-95'
                >
                  {Object.entries(StationNameMap)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([key, name]) => (
                      <SelectItem
                        key={key}
                        value={key}
                      >
                        {name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className='hidden md:flex md:justify-center pb-2'>
              <span className='text-lg text-muted-foreground'>→</span>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='to'>降車駅</Label>
              <Select
                value={to}
                onValueChange={setTo}
              >
                <SelectTrigger
                  id='to'
                  className='w-full bg-muted/40'
                >
                  <SelectValue placeholder='駅を選択' />
                </SelectTrigger>
                <SelectContent
                  position='popper'
                  className='max-h-95'
                >
                  {Object.entries(StationNameMap)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([key, name]) => (
                      <SelectItem
                        key={key}
                        value={key}
                      >
                        {name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end'>
            <div className='space-y-2'>
              <Label htmlFor='date'>乗車日</Label>
              <Input
                id='date'
                name='date'
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className='bg-background'
              />
            </div>

            <div className='hidden md:flex md:justify-center pb-2 invisible'>
              <span className='text-lg text-muted-foreground'>→</span>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='time'>出発時刻</Label>
              <TimePickerSelect
                id='time'
                value={time}
                onChange={setTime}
              />
            </div>
          </div>

          {error && (
            <Alert variant='destructive'>
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          <Button
            type='submit'
            className='h-12 w-full rounded-md'
          >
            列車を検索
          </Button>
        </form>
      </div>
    </div>
  );
};
