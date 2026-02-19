import { DateTime, Interval } from "luxon";

export type Slot = { start: string; end: string };

export type Overlap = {
  startUTC: string;
  endUTC: string;
  startLocal: string;
  endLocal: string;
  viewerZone: string;
};

function toInterval(slot: Slot, zone: string): Interval | null {
  const s = DateTime.fromISO(slot.start, { zone });
  const e = DateTime.fromISO(slot.end, { zone });
  if (!s.isValid || !e.isValid) return null;
  else if (e <= s) return null;
  else return Interval.fromDateTimes(s.toUTC(), e.toUTC());
}

export function overlappingSlots(
  viewerZone: string,
  userASlots: Slot[],
  userAZone: string,
  userBSlots: Slot[],
  userBZone: string,
): Overlap[] {
  const aIntervals = userASlots
    .map((s) => toInterval(s, userAZone))
    .filter(Boolean) as Interval[];
  const bIntervals = userBSlots
    .map((s) => toInterval(s, userBZone))
    .filter(Boolean) as Interval[];

  const overlaps: Overlap[] = [];
  for (const a of aIntervals) {
    for (const b of bIntervals) {
      const inter = a.intersection(b);
      if (inter && inter.isValid && inter.length("seconds") > 0) {
        const startUTC = inter.start.toUTC().toISO() ?? "";
        const endUTC = inter.end.toUTC().toISO() ?? "";
        const startLocal = inter.start.setZone(viewerZone).toISO() ?? "";
        const endLocal = inter.end.setZone(viewerZone).toISO() ?? "";
        overlaps.push({ startUTC, endUTC, startLocal, endLocal, viewerZone });
      }
    }
  }

  return overlaps;
}

export default overlappingSlots;
