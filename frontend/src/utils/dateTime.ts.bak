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
  try {
    const parts = dateYYYYMMDD.split('-');
    if (parts.length !== 3) return dateYYYYMMDD;

    const [year, month, day] = parts.map(Number);

    const isValidDate =
      !isNaN(year) && !isNaN(month) && !isNaN(day) && month >= 1 && month <= 12 && day >= 1 && day <= 31;

    return isValidDate ? `${year}年${month}月${day}日` : dateYYYYMMDD;
  } catch (e) {
    console.error('日付のフォーマット中にエラーが発生しました:', e);
    return dateYYYYMMDD;
  }
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
