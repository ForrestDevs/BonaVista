import React from 'react'

import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/lib/heros/HighImpact'
import { LowImpactHero } from '@/lib/heros/LowImpact'
import { MediumImpactHero } from '@/lib/heros/MediumImpact'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
}

export const Hero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
