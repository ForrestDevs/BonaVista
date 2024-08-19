// import PageTemplate, { generateMetadata } from './[slug]/page'

// export default PageTemplate

// export { generateMetadata }
import type { NextPage } from 'next'
import Head from 'next/head'
import Header from './components/header'
import Hero from './components/hero'
import Products from './components/products'
import ParallaxSection from './components/parallax-section'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>LuxeOutdoor - Premium Hot Tubs & Swim Spas</title>
        <link rel="icon" href="/favicon.ico" />
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600&display=swap"
          rel="stylesheet"
        /> */}
      </Head>

      <Header />
      <main>
        <Hero />
        <Products />
        <ParallaxSection />
        {/* Add more sections as needed */}
      </main>

      <footer className="bg-charcoal text-white py-12">
        <div className="container mx-auto px-8 text-center">
          <p className="text-sm uppercase tracking-wider">
            &copy; 2024 LuxeOutdoor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home
