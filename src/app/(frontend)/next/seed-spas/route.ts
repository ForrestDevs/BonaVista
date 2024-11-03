import { Spa } from '@payload-types'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'
import { formatSlug } from '@/payload/fields/slug-new/formatSlug'

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

export async function GET(request: NextRequest) {
  //   const filePath = path.join(process.cwd(), 'public', 'plh.csv')
  //   const fileContent = fs.readFileSync(filePath, 'utf8')

  // Fetch the CSV data from the URL
  const response = await fetch(
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vT0-LsshLlWScIZbRBzcj9qAZiEa1g8OK5cyK6H0GL4Nl08STYQxPyx80KQCl9KzykI2PcaTI0vM3Rh/pub?output=csv',
  )
  const csvText = await response.text()

  const parsedData = Papa.parse(csvText, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  })

  const spas: Spa[] = parsedData.data.map((row: any) => {
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

    const spa: Spa = {
      id: row['SKU'] || '',
      title: title,
      slug: formatSlug(row['Name'] || ''),
      description: row['Short description'] || null,
      modelYear: 2024,
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
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
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
          spa.pureWaterSystem = attributeValue as 'optional' | 'standard'
          break
        case 'Ez-Pure Zone':
          spa.ezZonePure = attributeValue as 'optional' | 'standard'
          break
        case 'Oasis Package':
          spa.oasisPackage = attributeValue as 'optional' | 'not-available'
          break
        case 'HydroFlex':
          spa.hydroFlex = attributeValue as 'optional' | 'not-available'
          break
        case 'I-Command':
          spa.iCommand = attributeValue as 'optional' | 'not-available'
          break
        case 'Northern Falls':
          spa.northernFalls = attributeValue as 'optional' | 'not-available'
          break
        case 'Chromatherapy':
          spa.chromatherapy = attributeValue as 'optional' | 'not-available'
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

  console.log(spas)

  return NextResponse.json({ message: 'success' })
}
