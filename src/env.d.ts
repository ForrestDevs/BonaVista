declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      NEXT_PUBLIC_SERVER_URL: string
      NEXT_PUBLIC_IS_LIVE: string
      NEXT_PRIVATE_DRAFT_SECRET: string
      REVALIDATION_KEY: string
      DATABASE_URL: string
      BLOB_READ_WRITE_TOKEN: string
      ZOHO_CLIENT_ID: string
      ZOHO_CLIENT_SECRET: string
      ZOHO_REDIRECT_URI: string
      ZOHO_REFRESH_TOKEN: string
      RESEND_API_KEY: string
      NEXT_PUBLIC_STRIPE_IS_TEST_KEY: string
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
      STRIPE_SECRET_KEY: string
      PAYLOAD_SECRET: string
      NEXT_PUBLIC_SERVER_URL: string
      NEXT_PUBLIC_URL: string
      NEXT_PUBLIC_IS_LIVE: string
      NEXT_PUBLIC_DRAFT_SECRET: string
      REVALIDATION_KEY: string
      NEXT_PUBLIC_CONSOLE_DEBUG_HOOKS: string
      OPENAI_API_KEY: string
      UPSTASH_REDIS_REST_URL: string
      UPSTASH_REDIS_REST_TOKEN: string
      NODEMAILER_USER: string
      NODEMAILER_PASS: string
      NODEMAILER_HOST: string
      NODEMAILER_PORT: string
      DEFAULT_FROM_ADDRESS: string
      DEFAULT_FROM_NAME: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
