// utils/isStationOpenNow.ts

/**
 * 將 "HH:MM" 時間字串轉換成「自午夜起的分鐘數」
 * 例如 "09:30" -> 570
 */
const parseTimeToMinutes = (time: string): number | null => {
  const trimmed = time.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
};

/**
 * 判斷現在時間是否在營業時段內
 * @param openHours 營業時間字串，例如：
 *   - "24H" （全天營業）
 *   - "09:00~18:00"
 *   - "09:00~12:00,13:00~18:00"
 *   - "22:00~06:00"（跨午夜）
 */
export const isStationOpenNow = (openHours?: string): boolean => {
  if (!openHours) return false;

  const norm = openHours.trim().toUpperCase();
  if (norm === "24H" || norm === "24:00") return true;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // 支援多時段，以逗號分隔
  const ranges = norm
    .split(",")
    .map(r => r.trim())
    .filter(Boolean);

  for (const range of ranges) {
    const [startStr, endStr] = range.split("~").map(p => p.trim());
    const startMin = parseTimeToMinutes(startStr);
    const endMin = parseTimeToMinutes(endStr);

    if (startMin === null || endMin === null) continue;

    if (startMin === endMin) {
      // 若開始時間與結束時間相同 → 視為全天營業
      return true;
    }

    if (startMin < endMin) {
      // 同日區間 [start, end)
      if (nowMinutes >= startMin && nowMinutes < endMin) return true;
    } else {
      // 跨午夜區間，例如 22:00~06:00
      if (nowMinutes >= startMin || nowMinutes < endMin) return true;
    }
  }

  return false;
};
