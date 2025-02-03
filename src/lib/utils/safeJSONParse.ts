export const safeJsonParse = (str: string | null | undefined): unknown => {
  if (str === null || str === undefined) {
    return null
  }
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}
