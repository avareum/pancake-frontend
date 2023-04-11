export default function isUndefinedOrNullOrBlankString(value: any): boolean {
  return value === null || value === undefined || value === ''
}
