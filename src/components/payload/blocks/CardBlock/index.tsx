import React from 'react'
import { CardBlockProps } from './types'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
  CardHeader,
} from '@/components/ui/card'

import {
  FaMoon,
  FaSwimmer,
  FaWalking,
  FaTheaterMasks,
  FaHeartbeat,
  FaBed,
  FaHeadSideVirus,
  FaHeadSideCough,
  FaUserInjured,
} from 'react-icons/fa'
import { BsEmojiHeartEyesFill } from 'react-icons/bs'
import { LiaWaveSquareSolid } from 'react-icons/lia'

export const CardBlock: React.FC<
  CardBlockProps & {
    id?: string
  }
> = async (props) => {
  const { type, title, description, icon } = props

  let Icon: React.ReactNode

  switch (icon) {
    case 'moon':
      Icon = <FaMoon />
      break
    case 'heart-eyes':
      Icon = <BsEmojiHeartEyesFill />
      break
    case 'swimming':
      Icon = <FaSwimmer />
      break
    case 'walking':
      Icon = <FaWalking />
      break
    case 'wave':
      Icon = <LiaWaveSquareSolid />
      break
    case 'theater-masks':
      Icon = <FaTheaterMasks />
      break
    case 'heart':
      Icon = <FaHeartbeat />
      break
    case 'sleeping':
      Icon = <FaBed />
      break
    case 'stress':
      Icon = <FaHeadSideVirus />
      break
    case 'aches':
      Icon = <FaUserInjured />
      break
    case 'sick':
      Icon = <FaHeadSideCough />
      break
    default:
      Icon = null
  }

  return (
    <Card>
      <CardContent>
        {type === 'icon' && Icon}
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardContent>
    </Card>
  )
}
