export const formatDateToJapanese = (dateString: string): string => {
  try {
    const parts = dateString.split('-');
    if (parts.length !== 3) {
      return dateString;
    }

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
      return dateString;
    }

    return `${year}年${month}月${day}日`;
  } catch (e) {
    console.error('日付のフォーマット中にエラーが発生しました:', e);
    return dateString;
  }
};
