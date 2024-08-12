import React from 'react'

import type { Page } from '@/payload-types'
import { HighImpactHero } from '@/components/layout/heros/high-impact'
import { LowImpactHero } from '@/components/layout/heros/low-impact'
import { MediumImpactHero } from '@/components/layout/heros/medium-impact'
import { PostHero } from '@/components/layout/heros/post-hero'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  postHero: PostHero,
}

export const Hero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
