import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Privacy Policy | BonaVista LeisureScapes',
  description: 'The privacy policy for BonaVista LeisureScapes website',
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What information do we collect?</h2>
        <p className="mb-4">
          We collect information from you within several areas of our website including, but not
          limited to, you subscribing to our newsletter, responding to a survey or filling out a
          form. You may, however, visit our site anonymously.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What do we use your information for?</h2>
        <p className="mb-4">
          Any of the information we collect from you may be used in one of the following ways:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>To send periodic promotional emails</li>
          <li>
            Used to send you information, respond to inquiries, and/or other requests or questions.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How do we protect your information?</h2>
        <p className="mb-4">
          We implement a variety of security measures to maintain the safety of your personal
          information when you enter, submit, or access your personal information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Do we use cookies?</h2>
        <p className="mb-4">
          We do use cookies on site, however in a secure fashion and cookies are set to expire upon
          closing your internet browser.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Do we disclose any information to outside parties?
        </h2>
        <p className="mb-4">
          We do not sell, trade, or otherwise transfer to outside parties your personally
          identifiable information. This does not include trusted third parties who assist us in
          operating our website, conducting our business, or servicing you, so long as those parties
          agree to keep this information confidential. We may also release your information to
          comply with the law, enforce our site policies, or protect ours or others rights,
          property, or safety.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Online Privacy Policy Only</h2>
        <p className="mb-4">
          This online privacy policy applies only to information collected through our website and
          not to information collected offline.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Consent</h2>
        <p className="mb-4">By using our site, you consent to our online privacy policy.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Changes to our Privacy Policy</h2>
        <p className="mb-4">
          If we decide to change our privacy policy, we will post those changes on this page so you
          should visit this page frequently
        </p>
      </section>
    </div>
  )
}
