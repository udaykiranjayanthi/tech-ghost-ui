export const displayDate = (date?: string) => {
  if (!date) return "-";

  return Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};
