export const specifyTrainTypeIconColor = (trainTypeName: string): string => {
  if (trainTypeName === 'はやぶさ') return 'bg-primary';
  if (trainTypeName === 'はやて') return 'bg-[oklch(0.62_0.210_350)]';
  if (trainTypeName === 'やまびこ') return 'bg-[oklch(0.45_0.13_155)]';

  return 'bg-[oklch(0.28_0.125_300)]';
};

export function normalizeTrainNumber(raw: string): string {
  const n = Number(raw);
  if (Number.isNaN(n)) {
    const stripped = raw.replace(/^0+(?=\d)/, '');
    return stripped.length ? stripped : '0';
  }
  return String(n);
}
