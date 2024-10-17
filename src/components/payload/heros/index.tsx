import React from 'react'
import type { Page } from '@payload-types'
import { HighImpactHero } from '@components/payload/heros/HighImpact'
import { LowImpactHero } from '@components/payload/heros/LowImpact'
import { MediumImpactHero } from '@components/payload/heros/MediumImpact'
import { ParallaxHero } from '@components/payload/heros/Parallax'
import { PostHero } from '@components/payload/heros/PostHero'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  postHero: PostHero,
  parallax: ParallaxHero,
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
