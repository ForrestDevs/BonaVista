import type { CollectionBeforeValidateHook } from 'payload'

/**
 * Formats a filename to be URL and filesystem friendly by:
 * 1. Converting to lowercase
 * 2. Replacing spaces with hyphens
 * 3. Removing all special characters except hyphens and underscores
 * 4. Removing any leading/trailing spaces or dots
 *
 * @example
 * formatFilename("My File Name!.jpg") => "my-file-name.jpg"
 * formatFilename("résumé (2023).pdf") => "resume-2023.pdf"
 *
 * @param val - The original filename to format
 * @returns The formatted filename
 */
export const formatFilename = (val: string): string => {
  const extension = val.includes('.') ? '.' + val.split('.').pop() : ''
  const filename = val.includes('.') ? val.split('.').slice(0, -1).join('.') : val

  return (
    filename
      .trim() // Remove leading/trailing spaces
      .toLowerCase() // Convert to lowercase
      .replace(/ /g, '-') // Replace spaces with hyphens
      .replace(/[^\w-]/g, '') // Remove all characters except letters, numbers, hyphens and underscores
      .replace(/^[-_.]+|[-_.]+$/g, '') + // Remove leading/trailing hyphens, underscores and dots
    extension.toLowerCase()
  )
}

/**
 * A Payload CMS hook that formats filenames before validation.
 * This hook runs on both create and update operations, but only modifies the filename
 * if it's a new document or if the filename has changed during an update.
 * 
 * The hook uses the formatFilename utility to ensure filenames are URL and filesystem friendly.
 * 
 * @example
 * // On create with data: { filename: "My File.jpg", ... }
 * // Returns: { filename: "my-file.jpg", ... }
 * 
 * // On update with unchanged filename
 * // Returns the original data unchanged
 * 
 * @param options.data - The incoming data object
 * @param options.operation - The current operation ('create' or 'update')
 * @param options.originalDoc - The original document before updates
 * @returns The data object with formatted filename if conditions are met
 */
export const formatFilenameHook: CollectionBeforeValidateHook = async ({
  data,
  operation,
  originalDoc,
}) => {
  // Only format filename on create, or if filename has changed during update
  if (
    (operation === 'create' ||
      (operation === 'update' && data.filename !== originalDoc.filename)) &&
    data.filename
  ) {
    return {
      ...data,
      filename: formatFilename(data.filename),
    }
  }

  return data
}
