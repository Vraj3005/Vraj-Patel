import { HeatmapCell } from '@/types/advanced';

/**
 * Parses a YYYY-MM-DD date string reliably as local midnight,
 * preventing timezone shift issues.
 */
export const parseDateString = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const formatLocalDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Pads the raw chronological contribution list to start on a Sunday
 * and end on a Saturday. Then segments the cells into 53 weeks.
 */
export const alignDataToWeeks = (rawData: HeatmapCell[]): (HeatmapCell & { isPlaceholder?: boolean })[][] => {
  if (rawData.length === 0) return [];

  const aligned = [...rawData];

  const firstDate = parseDateString(aligned[0].date);
  const firstDayOfWeek = firstDate.getDay(); // 0 is Sunday, 1 is Monday...

  // Prepend empty cells to align the first week to Sunday
  if (firstDayOfWeek > 0) {
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(firstDate);
      prevDate.setDate(firstDate.getDate() - (firstDayOfWeek - i));
      aligned.unshift({
        date: formatLocalDate(prevDate),
        count: 0,
        level: 0,
        isPlaceholder: true
      } as any);
    }
  }

  // Append empty cells to align the last week to Saturday (6)
  const lastDate = parseDateString(aligned[aligned.length - 1].date);
  const lastDayOfWeek = lastDate.getDay();
  if (lastDayOfWeek < 6) {
    for (let i = lastDayOfWeek + 1; i <= 6; i++) {
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + (i - lastDayOfWeek));
      aligned.push({
        date: formatLocalDate(nextDate),
        count: 0,
        level: 0,
        isPlaceholder: true
      } as any);
    }
  }

  const weeksList: (HeatmapCell & { isPlaceholder?: boolean })[][] = [];
  let currentWeek: (HeatmapCell & { isPlaceholder?: boolean })[] = [];
  aligned.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeksList.push(currentWeek);
      currentWeek = [];
    }
  });

  return weeksList.slice(-53);
};

