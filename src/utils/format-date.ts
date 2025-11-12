function formatDate(value: string) {
  return value ? new Date(value).toDateString() : '';
}
export { formatDate };
