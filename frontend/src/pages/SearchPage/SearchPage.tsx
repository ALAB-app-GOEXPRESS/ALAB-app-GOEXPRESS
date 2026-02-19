import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { nowHHMM, todayYYYYMMDD } from '@/utils/dateTime';
import { isValidDateYYYYMMDD, isValidTimeHHMM } from '@/utils/validators';

import { ArrowRight } from 'lucide-react';

// API仮置き
type Station = {
  cd: string;
  name: string;
};

const STATIONS: Station[] = [
  { cd: '01', name: '東京' },
  { cd: '02', name: '上野' },
];

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

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();

  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [date, setDate] = useState<string>(todayYYYYMMDD());
  const [time, setTime] = useState<string>(nowHHMM());

  const [error, setError] = useState<string>('');

  const fromName = useMemo(() => STATIONS.find((s) => s.cd === from)?.name ?? '', [from]);
  const toName = useMemo(() => STATIONS.find((s) => s.cd === to)?.name ?? '', [to]);

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
    <div className='min-h-[calc(100vh-64px)] bg-background'>
      <div className='mx-auto w-full max-w-3xl px-4 py-10'>
        <div className='text-xl font-bold'>新幹線をさがす</div>

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
                  className='bg-muted/40'
                >
                  <SelectValue placeholder='駅を選択' />
                </SelectTrigger>
                <SelectContent>
                  {STATIONS.map((s) => (
                    <SelectItem
                      key={s.cd}
                      value={s.cd}
                    >
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='hidden md:flex md:justify-center'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                <ArrowRight className='h-5 w-5' />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='to'>降車駅</Label>
              <Select
                value={to}
                onValueChange={setTo}
              >
                <SelectTrigger
                  id='to'
                  className='bg-muted/40'
                >
                  <SelectValue placeholder='駅を選択' />
                </SelectTrigger>
                <SelectContent>
                  {STATIONS.map((s) => (
                    <SelectItem
                      key={s.cd}
                      value={s.cd}
                    >
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 日付・時刻（2カラム） */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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

            <div className='space-y-2'>
              <Label htmlFor='time'>出発時刻</Label>
              <Input
                id='time'
                name='time'
                type='time'
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className='bg-background'
              />
            </div>
          </div>

          {/* エラー */}
          {error && (
            <Alert variant='destructive'>
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          {/* ボタン（画像の緑ボタン寄せ） */}
          <Button
            type='submit'
            className='h-12 w-full rounded-md bg-emerald-600 text-white hover:bg-emerald-700'
          >
            列車を検索
          </Button>

          {/* 補足（任意） */}
          <div className='text-sm text-muted-foreground'>
            {from && to ? (
              <>
                選択中：{fromName} → {toName} ／ {date} {time} 以降
              </>
            ) : (
              <>駅・日付・時刻を入力して検索してください。</>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
