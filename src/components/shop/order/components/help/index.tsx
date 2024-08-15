import React from 'react'
import { H1 } from '@/components/ui/typography'
import Link from 'next/link'

const Help = () => {
  return (
    <div className="mt-6">
      <H1>Need help?</H1>
      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          <li>
            <Link href="/contact">Returns & Exchanges</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
