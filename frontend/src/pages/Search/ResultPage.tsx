import React, { useMemo } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type TrainSearchParams = {
  from: string;
  to: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
};

type TrainResult = {
  id: string;
  trainName: string; // のぞみ/ひかり/こだま等
  departStation: string;
  arriveStation: string;
  departTime: string; // HH:mm
  arriveTime: string; // HH:mm
  durationMinutes: number;
  priceYen: number;
};

// 駅名表示のためのマップ（Search側の値に合わせる）
const STATION_NAME: Record<string, string> = {
  '01': '東京',
  '02': '上野',
  // 必要に応じて追加
};

// --------- utils ---------
const isValidDateYYYYMMDD = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const isValidTimeHHMM = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

function parseQuery(sp: URLSearchParams): { ok: true; params: TrainSearchParams } | { ok: false; reason: string } {
  const from = sp.get('from') ?? '';
  const to = sp.get('to') ?? '';
  const date = sp.get('date') ?? '';
  const time = sp.get('time') ?? '';

  if (!from) return { ok: false, reason: 'from がありません' };
  if (!to) return { ok: false, reason: 'to がありません' };
  if (from === to) return { ok: false, reason: 'from と to が同じです' };
  if (!date || !isValidDateYYYYMMDD(date)) return { ok: false, reason: 'date が不正です' };
  if (!time || !isValidTimeHHMM(time)) return { ok: false, reason: 'time が不正です' };

  return { ok: true, params: { from, to, date, time } };
}

function addMinutesToHHMM(hhmm: string, addMin: number) {
  const [hh, mm] = hhmm.split(':').map(Number);
  const total = hh * 60 + mm + addMin;
  const h = Math.floor((total % (24 * 60)) / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatYen(n: number) {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(n);
}

/**
 * 今はダミー検索（後でAPI呼び出しに差し替え）
 * params を受けて結果配列を返すだけの純関数にしておくと差し替えが簡単です。
 */
function searchTrainsMock(params: TrainSearchParams): TrainResult[] {
  const baseDepart = params.time;

  const fromName = STATION_NAME[params.from] ?? params.from;
  const toName = STATION_NAME[params.to] ?? params.to;

  // のぞみ/ひかり/こだまの例（ダミー）
  const patterns = [
    { name: 'のぞみ', duration: 95, price: 14650 },
    { name: 'ひかり', duration: 110, price: 14120 },
    { name: 'こだま', duration: 150, price: 13200 },
  ];

  return patterns.map((p, i) => {
    const departTime = addMinutesToHHMM(baseDepart, i * 15);
    const arriveTime = addMinutesToHHMM(departTime, p.duration);
    return {
      id: `${params.date}-${params.from}-${params.to}-${p.name}-${departTime}`,
      trainName: p.name,
      departStation: fromName,
      arriveStation: toName,
      departTime,
      arriveTime,
      durationMinutes: p.duration,
      priceYen: p.price,
    };
  });
}

// --------- component ---------
export const ResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const parsed = useMemo(() => parseQuery(searchParams), [searchParams]);

  // クエリが不正なら検索ページに戻す（ルートはあなたの構成に合わせて変更）
  if (!parsed.ok) {
    return (
      <Navigate
        to='/search'
        replace
      />
    );
  }

  const { params } = parsed;

  const results = useMemo(() => searchTrainsMock(params), [params]);

  const fromName = STATION_NAME[params.from] ?? params.from;
  const toName = STATION_NAME[params.to] ?? params.to;

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <h1 style={{ margin: 0 }}>検索結果</h1>
        <Link
          to={`/search?from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(params.to)}&date=${encodeURIComponent(params.date)}&time=${encodeURIComponent(params.time)}`}
        >
          条件を変更
        </Link>
      </header>

      <section style={{ marginTop: 12, padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>検索条件</div>
        <div>
          区間：{fromName} → {toName}
        </div>
        <div>日付：{params.date}</div>
        <div>出発：{params.time} 以降</div>
      </section>

      <section style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <h2 style={{ margin: 0 }}>候補 {results.length} 件</h2>
          <Button
            type='button'
            onClick={() => {
              // 例：結果の並び替えなど（今はダミー）
              alert('並び替え（ダミー）');
            }}
          >
            並び替え
          </Button>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, marginTop: 12, display: 'grid', gap: 12 }}>
          {results.map((r) => (
            <li
              key={r.id}
              style={{ border: '1px solid #ddd', borderRadius: 10, padding: 12 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{r.trainName}</div>
                  <div style={{ marginTop: 4 }}>
                    <span style={{ fontWeight: 700 }}>{r.departTime}</span> {r.departStation}
                    {'  →  '}
                    <span style={{ fontWeight: 700 }}>{r.arriveTime}</span> {r.arriveStation}
                  </div>
                  <div style={{ marginTop: 4, color: '#555' }}>所要 {r.durationMinutes} 分</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800 }}>{formatYen(r.priceYen)}</div>
                  <div style={{ marginTop: 8 }}>
                    <Button
                      type='button'
                      onClick={() => {
                        // 例：詳細ページや予約導線へ
                        alert(`選択: ${r.trainName} ${r.departTime} 発`);
                      }}
                    >
                      この列車を選ぶ
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {results.length === 0 && (
          <div style={{ marginTop: 16, padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
            条件に一致する列車が見つかりませんでした。
          </div>
        )}
      </section>
    </div>
  );
};
