import { put } from '@vercel/blob'
import { list, del } from '@vercel/blob'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const uploadDirectory = async (dirPath: string) => {
  // Delete all blobs
  await deleteAllBlobs().catch((error) => {
    console.error('An error occurred:', error)
  })

  // Get absolute path if relative path provided
  const absolutePath = path.resolve(dirPath)

  const token = process.env.BLOB_READ_WRITE_TOKEN

  // Verify directory exists
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Directory ${absolutePath} does not exist`)
  }

  const processFile = async (filePath: string) => {
    try {
      const fileName = path.basename(filePath)
      const fileKey = path.posix.join('bonavista/', fileName)
      const fileBuffer = await fs.promises.readFile(filePath)
      const contentType = getContentType(fileName)

      console.log(`Uploading ${fileName}...`)

      const blob = await put(fileKey, fileBuffer, {
        addRandomSuffix: false,
        contentType,
        access: 'public',
        token,
      })

      console.log(`Successfully uploaded ${fileName}`)
      console.log(`URL: ${blob.url}`)

      return blob
    } catch (error) {
      console.error(`Failed to upload ${filePath}:`, error)
      return null
    }
  }

  const processDirectory = async (currentPath: string) => {
    const entries = await fs.promises.readdir(currentPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name)

      if (entry.isDirectory()) {
        await processDirectory(fullPath)
      } else {
        await processFile(fullPath)
      }
    }
  }

  await processDirectory(absolutePath)
}

const getContentType = (fileName: string): string => {
  const ext = path.extname(fileName).toLowerCase()
  const contentTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
  }
  return contentTypes[ext] || 'application/octet-stream'
}

async function deleteAllBlobs() {
  let cursor

  do {
    const listResult = await list({
      cursor,
      limit: 1000,
    })

    if (listResult.blobs.length > 0) {
      await del(listResult.blobs.map((blob) => blob.url))
    }

    cursor = listResult.cursor
  } while (cursor)

  console.log('All blobs were deleted')
}

uploadDirectory('./public/blob')
  .then(() => console.log('Upload complete'))
  .catch(console.error)
