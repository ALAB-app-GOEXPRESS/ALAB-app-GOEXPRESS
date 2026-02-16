export function isValidDateYYYYMMDD(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function isValidTimeHHMM(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}
