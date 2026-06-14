export function getRelativeDateString(targetDay: number) {
  const now = new Date();
  const currentDay = now.getDay();
  const diff = targetDay >= currentDay ? targetDay - currentDay : 7 - currentDay + targetDay;
  const targetDate = new Date(now.getTime() + diff * 24 * 60 * 60 * 1000);

  const formatter = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  const formatted = formatter.format(targetDate);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
