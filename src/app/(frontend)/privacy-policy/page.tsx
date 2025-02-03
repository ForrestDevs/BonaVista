import React from 'react'

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <p className="mb-4">We collect information that you provide directly to us when you:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Create an account</li>
          <li>Make a purchase</li>
          <li>Sign up for our newsletter</li>
          <li>Contact us for support</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
        <p className="mb-4">We use the information we collect to:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Process your orders and payments</li>
          <li>Send you order confirmations and updates</li>
          <li>Provide customer support</li>
          <li>Send marketing communications (with your consent)</li>
          <li>Improve our products and services</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
        <p className="mb-4">We do not sell or rent your personal information to third parties. We may share your information with:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Service providers who assist in our operations</li>
          <li>Law enforcement when required by law</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
        <p className="mb-4">You have the right to:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Opt-out of marketing communications</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p>If you have any questions about our privacy policy, please contact us at:</p>
        <p className="mt-2">
          Email: privacy@bonavistaleisurescapes.com<br />
          Phone: 1-800-XXX-XXXX
        </p>
      </section>
    </div>
  )
}
