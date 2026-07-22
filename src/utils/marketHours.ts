/**
 * US Stock Market Hours utility
 * Market is open Mon–Fri 09:30–16:00 Eastern Time (ET).
 * We derive ET offset from UTC without external libraries.
 */

/** Returns the current date/time expressed in US/Eastern (handles DST). */
function nowInET(): Date {
  // Use Intl to get the ET wall-clock, then reconstruct a Date in local-time
  // coordinates so we can do arithmetic with getHours/getMinutes/getDay.
  const etString = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());

  // etString is like "07/21/2026, 11:30:00"
  const [datePart, timePart] = etString.split(', ');
  const [month, day, year] = datePart.split('/');
  const [hour, minute, second] = timePart.split(':');

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  );
}

export interface MarketStatus {
  isOpen: boolean;
  /** Seconds until market opens (only meaningful when isOpen===false). */
  secondsToOpen: number;
  /** Seconds until market closes (only meaningful when isOpen===true). */
  secondsToClose: number;
  /** Human-readable label, e.g. "Closes in 02:15:34" or "Opens in 14:30:00". */
  statusLabel: string;
}

/** Format seconds as HH:MM:SS */
function formatSeconds(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

export function getMarketStatus(): MarketStatus {
  const et = nowInET();
  const dayOfWeek = et.getDay(); // 0=Sun, 6=Sat
  const h = et.getHours();
  const m = et.getMinutes();
  const s = et.getSeconds();

  const currentMinutes = h * 60 + m + s / 60;
  const openMinutes = 9 * 60 + 30;  // 09:30
  const closeMinutes = 16 * 60;      // 16:00

  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const isDuringHours = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  const isOpen = isWeekday && isDuringHours;

  if (isOpen) {
    const secondsToClose = Math.max(0, (closeMinutes - currentMinutes) * 60);
    return {
      isOpen: true,
      secondsToOpen: 0,
      secondsToClose,
      statusLabel: `Closes in ${formatSeconds(secondsToClose)}`,
    };
  }

  // Calculate seconds until next open
  let daysUntilOpen = 0;
  let testDay = dayOfWeek;

  if (isWeekday && currentMinutes < openMinutes) {
    // Before open today
    const secondsToOpen = (openMinutes - currentMinutes) * 60;
    return {
      isOpen: false,
      secondsToOpen,
      secondsToClose: 0,
      statusLabel: `Opens in ${formatSeconds(secondsToOpen)}`,
    };
  }

  // After close or weekend – find next weekday
  do {
    daysUntilOpen++;
    testDay = (testDay + 1) % 7;
  } while (testDay === 0 || testDay === 6); // skip Sun/Sat

  const secondsUntilMidnight = (24 * 60 - currentMinutes) * 60;
  const secondsToOpen = secondsUntilMidnight + (daysUntilOpen - 1) * 86400 + openMinutes * 60;

  return {
    isOpen: false,
    secondsToOpen,
    secondsToClose: 0,
    statusLabel: `Opens ${daysUntilOpen === 1 ? 'tomorrow' : `in ${daysUntilOpen} days`}`,
  };
}
