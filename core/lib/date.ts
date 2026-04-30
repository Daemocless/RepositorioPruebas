export function toInputDate(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}
