// 'use client'

// import React from 'react'

// import type { Header as HeaderType } from '@/payload-types'
// import type { CMSLinkType } from '../../Link' // Add this import

// import { CMSLink } from '../../Link'

// export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
//   const navItems = header?.navItems || []

//   return (
//     <nav className="flex gap-3 items-center">
//       {navItems.map(({ link: { newTab = false, ...rest } }, i) => {
//         const isNewTab = newTab ?? false // Ensure newTab is boolean
//         return <CMSLink key={i} {...(rest as CMSLinkType)} appearance="link" newTab={isNewTab} />
//       })}
//     </nav>
//   )
// }
