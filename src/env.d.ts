declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URI: string
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL: string
      DATABASE_URI: string
      S3_ENDPOINT: string
      S3_ACCESS_KEY_ID: string
      S3_SECRET_ACCESS_KEY: string
      S3_BUCKET: string
      S3_REGION: string
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
      STRIPE_SECRET_KEY: string
      NEXT_PUBLIC_STRIPE_IS_TEST_KEY: string
      OPENAI_API_KEY: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
