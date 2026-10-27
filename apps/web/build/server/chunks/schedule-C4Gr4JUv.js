const addDays = (d, n) => new Date(d.getTime() + n * 864e5);
const iso = (d) => d.toISOString().slice(0, 10);
function buildSchedule(p) {
  if (p.slotMinutes < 60 || p.slotMinutes > 120) throw new RangeError("slotMinutes must be between 60 and 120");
  const rest = new Set(p.restDays ?? [0]);
  const start = /* @__PURE__ */ new Date(`${p.startDate}T00:00:00Z`), end = /* @__PURE__ */ new Date(`${p.endDate}T00:00:00Z`);
  if (end < start) throw new RangeError("endDate before startDate");
  const sessions = [];
  for (let d = start; d <= end; d = addDays(d, 1)) {
    if (!rest.has(d.getUTCDay())) sessions.push({ date: iso(d), start: p.slotStart, minutes: p.slotMinutes });
  }
  const studyDaysPerWeek = 7 - rest.size;
  const weeklyMinutesAvailable = studyDaysPerWeek * p.slotMinutes;
  return { sessions, weeklyMinutesAvailable, meetsGoal: weeklyMinutesAvailable >= p.weeklyHourGoal * 60 };
}
function studyStatus(minutesStudied, weeklyGoalHours, dayOfWeekIndex) {
  if (minutesStudied <= 0) return "not_started";
  const expected = weeklyGoalHours * 60 * (dayOfWeekIndex + 1) / 7;
  return minutesStudied >= expected * 0.75 ? "on_track" : "behind";
}

export { buildSchedule as b, studyStatus as s };
//# sourceMappingURL=schedule-C4Gr4JUv.js.map
