import type { FieldHook } from 'payload'

const formatAltFromFilename = (filename: string): string => {
  if (!filename) return ''
  
  // Remove file extension
  const nameWithoutExt = filename.split('.').slice(0, -1).join('.')
  
  // Remove special characters (including dots) and replace with spaces
  const cleaned = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, ' ')
  
  // Trim spaces, capitalize first letter of each word, remove any remaining dots
  return cleaned
    .trim()
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .replace(/\./g, ' ') // Remove any remaining dots
    .replace(/\s+/g, ' ') // Collapse multiple spaces into single space
    .trim()
}

export const formatAltHook: FieldHook = ({ data, operation }) => {
  if (!data.filename) return data.alt

  if (operation === 'create' && data.filename) {
    return formatAltFromFilename(data.filename)
  }

  return data.alt
}
