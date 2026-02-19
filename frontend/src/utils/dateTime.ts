export function todayYYYYMMDD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function nowHHMM() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function formatJapaneseDate(dateYYYYMMDD: string) {
  const [y, m, d] = dateYYYYMMDD.split('-').map(Number);
  if (!y || !m || !d) return dateYYYYMMDD;
  return `${y}年${m}月${d}日`;
}

export function toHHMM(time: string): string {
  const [hh, mm] = time.split(':');
  return `${hh}:${mm}`;
}

export function calcDurationMin(departureHHMM: string, arrivalHHMM: string): number {
  const [dh, dm] = departureHHMM.split(':').map(Number);
  const [ah, am] = arrivalHHMM.split(':').map(Number);

  const dep = dh * 60 + dm;
  const arr = ah * 60 + am;

  const diff = arr >= dep ? arr - dep : arr + 24 * 60 - dep;
  return diff;
}
