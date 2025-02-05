import React from 'react'

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
        <p className="mb-4">
          By accessing and using this website, you accept and agree to be bound by the terms and
          provision of this agreement.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Use License</h2>
        <p className="mb-4">
          Permission is granted to temporarily download one copy of the materials (information or
          software) on BonaVista Leisurescapes&apos;s website for personal, non-commercial
          transitory viewing only.
        </p>
        <p className="mb-4">
          This is the grant of a license, not a transfer of title, and under this license you may
          not:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose</li>
          <li>Attempt to decompile or reverse engineer any software contained on the website</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
        <p className="mb-4">
          The materials on BonaVista Leisurescapes&apos;s website are provided on an &apos;as
          is&apos; basis. BonaVista Leisurescapes makes no warranties, expressed or implied, and
          hereby disclaims and negates all other warranties including, without limitation, implied
          warranties or conditions of merchantability, fitness for a particular purpose, or
          non-infringement of intellectual property or other violation of rights.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
        <p className="mb-4">
          In no event shall BonaVista Leisurescapes or its suppliers be liable for any damages
          (including, without limitation, damages for loss of data or profit, or due to business
          interruption) arising out of the use or inability to use the materials on the website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
        <p className="mb-4">
          These terms and conditions are governed by and construed in accordance with the laws of
          Canada and you irrevocably submit to the exclusive jurisdiction of the courts in that
          location.
        </p>
      </section>
    </div>
  )
}
