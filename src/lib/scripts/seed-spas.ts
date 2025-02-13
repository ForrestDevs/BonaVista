import { BasePayload, getPayload } from 'payload'
import config from '@payload-config'
import { Spa } from '@payload-types'
import Papa from 'papaparse'
import { formatSlug } from '@/payload/fields/slug/formatSlug'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Constants for determining type and collection
const TYPE_MAP: Record<string, 'hot-tub' | 'swim-spa'> = {
  'Hot Tub Collection': 'hot-tub',
  'Swim Spa Collection': 'swim-spa',
}

const HOT_TUB_COLLECTIONS = {
  Serenity: 'serenity',
  'Signature Self Cleaning': 'self-cleaning',
} as const

const SWIM_SPA_COLLECTIONS = {
  'Executive Trainer': 'executive-trainer',
  'Executive Sport': 'executive-sport',
  'Aqua Trainer': 'aqua-trainer',
  'Aqua Sport': 'aqua-sport',
  'Aqua Play': 'aqua-play',
} as const

const HT_MEDIA_FOLDER = '672d15e81006691619cdf6fd'
const SWIM_SPA_MEDIA_FOLDER = '672d16091006691619cdf7c1'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Helper function to get the correct image filepath
const getImagePath = (
  spa: Omit<Spa, 'createdAt' | 'updatedAt' | 'id'>,
  imageType: 'thumb' | 'top',
  mediaDir: string,
  payload: BasePayload,
): string => {
  // Determine the collection subdirectory
  let collectionDir = ''
  if (spa.type === 'hot-tub') {
    if (spa.hotTubCollection === 'serenity') {
      collectionDir = 'serenity'
    } else if (spa.hotTubCollection === 'self-cleaning') {
      collectionDir = 'signature'
    }
  } else {
    collectionDir = 'swimspa'
  }

  // Get the model number from the spa ID
  const modelNum = spa.model

  // Build the complete filepath
  const filename = `${modelNum}-${imageType === 'thumb' ? 'thumbnail' : 'topside'}`
  const extensions = ['.webp', '.png', '.jpg', '.jpeg']
  const existingFile = extensions.find((ext) =>
    fs.existsSync(path.resolve(mediaDir, collectionDir, imageType, filename + ext)),
  )
  const finalFilename = existingFile ? filename + existingFile : filename + '.webp' // Default to .webp if no file found

  const imagePath = path.resolve(mediaDir, collectionDir, imageType, finalFilename)

  if (!fs.existsSync(imagePath)) {
    payload.logger.warn(`— Warning: Image not found at ${imagePath}`)
  }

  return imagePath
}

async function seedSpas() {
  const payload = await getPayload({ config })

  const mediaDir = path.resolve(dirname, '../../../public/ht')
  payload.logger.info(`— Reading Media directory: ${mediaDir}`)
  const mediaFiles = fs
    .readdirSync(mediaDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
  payload.logger.info(`— Found ${mediaFiles.length} media files in ${mediaDir}`)

  payload.logger.info('— Fetching CSV data...')
  // Fetch the CSV data from the URL
  const response = await fetch(
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vT0-LsshLlWScIZbRBzcj9qAZiEa1g8OK5cyK6H0GL4Nl08STYQxPyx80KQCl9KzykI2PcaTI0vM3Rh/pub?output=csv',
  )
  const csvText = await response.text()

  payload.logger.info('— Parsing CSV data...')
  const parsedData = Papa.parse(csvText, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  })

  payload.logger.info('— Mapping CSV data to Spa interface...')

  const spas: Omit<Spa, 'createdAt' | 'updatedAt' | 'id'>[] = parsedData.data.map((row: any) => {
    const title = row['Name'] || ''
    let spaType: 'hot-tub' | 'swim-spa' = 'hot-tub' // Default type
    let hotTubCollection: Spa['hotTubCollection'] = null
    let swimSpaCollection: Spa['swimSpaCollection'] = null

    for (const [keyword, collection] of Object.entries(HOT_TUB_COLLECTIONS)) {
      if (title.includes(keyword)) {
        spaType = 'hot-tub'
        hotTubCollection = collection
        break
      }
    }

    if (!hotTubCollection) {
      for (const [keyword, collection] of Object.entries(SWIM_SPA_COLLECTIONS)) {
        if (title.includes(keyword)) {
          spaType = 'swim-spa'
          swimSpaCollection = collection
          break
        }
      }
    }

    if (row['Categories']) {
      // Check the type based on Categories
      for (const [keyword, type] of Object.entries(TYPE_MAP)) {
        if (row['Categories'].includes(keyword)) {
          spaType = type
          break
        }
      }
    }

    const seatingDesign = row['Seating Design'] || null
    const swimSystem = row['Swim System'] || null
    const startingFrom = row['Starting From'] || null
    const sizeCategory = row['Size Category'] || null
    const energyEfficiency = parseFloat(row['Energy Effeciency']) || null
    const hydroGuide = row['Hydro Guide'] || null
    const threeDModel = row['3D Model'] || null

    const spa: Omit<Spa, 'createdAt' | 'updatedAt' | 'id'> = {
      title: title,
      slug: formatSlug(row['Name'] || ''),
      description: row['Short description'] || null,
      modelYear: 2024,
      model: row['SKU'] || '',
      threeDModel,
      type: spaType,
      hotTubCollection,
      swimSpaCollection,
      seatingDesign,
      swimSystem,
      startingPrice: startingFrom,
      sizeCategory,
      energyEfficiency,
      hydroGuide,
    }

    // Loop through attribute pairs
    for (let i = 4; i < Object.keys(row).length; i += 2) {
      const attributeName = row[`Attribute ${(i - 4) / 2 + 1} name`]
      const attributeValue = row[`Attribute ${(i - 4) / 2 + 1} value(s)`]

      // Map each attribute name to the correct Spa interface property
      switch (attributeName) {
        case 'Seating':
          spa.seating = attributeValue || null
          break
        case 'Therapy Jets':
          spa.jets = attributeValue || null
          break
        case 'Dimensions':
          spa.dimensions = attributeValue || null
          break
        case 'Height':
          spa.height = attributeValue || null
          break
        case 'Volume':
          spa.volume = attributeValue || null
          break
        case 'Weight Empty':
          spa.weightEmpty = attributeValue || null
          break
        case 'Weight Full':
          spa.weightFull = attributeValue || null
          break
        case 'Swim Area':
          spa.swimArea = attributeValue || null
          break
        case 'Jet Pumps':
          spa.jetPumps = attributeValue || null
          break
        case 'Interior Lighting':
          spa.interiorLighting = attributeValue || null
          break
        case 'Exterior Lighting':
          spa.exteriorLighting = attributeValue || null
          break
        case 'Water Falls':
          spa.waterFalls = attributeValue || null
          break
        case 'Self-Cleaning':
          spa.selfCleaning = attributeValue === 'Yes'
          break
        case 'Circulation Pump':
          spa.circulationPump = attributeValue === 'Yes'
          break
        case 'Automated Wellness':
          spa.automatedWellness = attributeValue === 'Yes'
          break
        case 'Pure Water System':
          spa.pureWaterSystem = attributeValue.toLowerCase() as 'optional' | 'standard'
          break
        case 'Ez-Pure Zone':
          spa.ezZonePure = attributeValue.toLowerCase() as 'optional' | 'standard'
          break
        case 'Oasis Package':
          spa.oasisPackage =
            attributeValue.toLowerCase() === 'n/a'
              ? 'not-available'
              : (attributeValue.toLowerCase() as 'optional' | 'not-available')
          break
        case 'HydroFlex':
          spa.hydroFlex = attributeValue.toLowerCase() as 'optional' | 'not-available'
          break
        case 'I-Command':
          spa.iCommand = attributeValue.toLowerCase() as 'optional' | 'not-available'
          break
        case 'Northern Falls':
          spa.northernFalls =
            attributeValue.toLowerCase() === 'n/a'
              ? 'not-available'
              : (attributeValue.toLowerCase() as 'optional' | 'not-available')
          break
        case 'Chromatherapy':
          spa.chromatherapy = attributeValue.toLowerCase() as 'optional' | 'not-available'
          break
        case 'Heater':
          spa.heater = attributeValue || null
          break
        case 'Electrical':
          spa.electrical = attributeValue || null
          break
        case 'Warranty':
          spa.warranty = attributeValue || null
          break
        default:
          break
      }
    }

    return spa
  })

  payload.logger.info(`— Seeding ${spas.length} spas...`)

  try {
    for (const spa of spas) {
      payload.logger.info(`— Seeding spa: ${spa.title}`)

      const mediaFolderId = spa.type === 'hot-tub' ? HT_MEDIA_FOLDER : SWIM_SPA_MEDIA_FOLDER
      const thumbImagePath = getImagePath(spa, 'thumb', mediaDir, payload)
      const topsideImagePath = getImagePath(spa, 'top', mediaDir, payload)

      payload.logger.info(`— Creating thumbnail image for ${spa.title}`)
      const thumbImage = await payload.create({
        collection: 'media',
        data: {
          alt: `${spa.title} Thumbnail Image`,
          // folder: [mediaFolderId],
        },
        filePath: thumbImagePath,
      })
      payload.logger.info(`— Thumbnail image id: ${thumbImage.id}`)

      payload.logger.info(`— Creating topdown image for ${spa.title}`)
      const topsideImage = await payload.create({
        collection: 'media',
        data: {
          alt: `${spa.title} Topdown Image`,
          // folder: [mediaFolderId],
        },
        filePath: topsideImagePath,
      })
      payload.logger.info(`— Topdown image id: ${topsideImage.id}`)

      payload.logger.info(`— Creating spa record for ${spa.title}`)
      //   payload.logger.info(JSON.stringify(spa, null, 2))

      try {
        await payload.create({
          collection: 'spas',
          data: {
            ...spa,
            thumbnail: thumbImage.id,
            topdown: topsideImage.id,
          },
        })

        payload.logger.info(`— Successfully created spa record for ${spa.title}`)
      } catch (error) {
        payload.logger.error(`— Error creating spa record for ${spa.title}:`, error)
      }
    }
  } catch (error) {
    payload.logger.error('— Error seeding spas:', error)
  }
}

seedSpas()
  .then(() => {
    console.log('Seeding script finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error in seeding script:', error)
    process.exit(1)
  })
